<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\Sale;
use App\Models\Trade;
use App\Models\Wishlist;
use App\Models\User;
use App\Models\Figurine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ListingController extends Controller
{
    public function index()
    {
        $figurines = Figurine::with('photos:id,figurine_id,path')
            ->where('user_id', Auth::id())
            ->get();

        $listings = Auth::user()->listings()
            ->with(['figurine.photos' => function ($query) {
                $query->select('id', 'figurine_id', 'path');
            }])
            ->where('status', 'available')
            ->get();

        $openTrades = Trade::where('seller_id', Auth::id())
            ->whereIn('status', ['pending', 'awaiting_confirmation'])
            ->with([
                'figurines.photos:id,figurine_id,path',
                'buyer',
                'listing.figurine.photos:id,figurine_id,path'
            ])
            ->get();

        // Load trades for both the buyer and the seller
        $trades = Trade::where(function ($query) {
            $query->where('buyer_id', Auth::id())
                ->orWhere('seller_id', Auth::id());
        })
            ->with([
                'listing.figurine.photos:id,figurine_id,path', // get the figurine involved in trade
                'buyer:id,name', // get the buyer's name
                'seller:id,name', // get the seller's name
            ])
            ->get();

        // Load sales for both the buyer and the seller
        $sales = Sale::where(function ($query) {
            $query->where('buyer_id', Auth::id())
                ->orWhere('seller_id', Auth::id());
        })
            ->with([
                'listing.figurine.photos:id,figurine_id,path',
                'buyer:id,name',
                'seller:id,name',
            ])
            ->get();

        return Inertia::render('Dashboard/Listing/Page', [
            'figurines' => $figurines,
            'listings' => $listings,
            'openTrades' => $openTrades,
            'sales' => $sales,
            'trades' => $trades, // Pass trades to the frontend
        ]);
    }



    public function store(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'figurine_id' => 'required|exists:figurines,id', // Ensure figurine exists in the user's collection
            'price' => 'required|numeric',
            'is_tradeable' => 'required|boolean',
            'is_duplicate' => 'required|boolean',
            'stock' => 'required|integer|min:1', // Validate the stock input
        ]);

        // Fetch the figurine from the database
        $figurine = Figurine::findOrFail($request->input('figurine_id'));

        // Ensure the stock for the listing does not exceed the available figurine stock
        if ($request->input('stock') > $figurine->quantity) {
            return back()->withErrors('Stock for the listing cannot exceed the available figurine stock.');
        }

        // Create a new listing for the figurine
        Listing::create([
            'figurine_id' => $request->input('figurine_id'),
            'price' => $request->input('price'),
            'is_tradeable' => $request->input('is_tradeable'),
            'is_duplicate' => $request->input('is_duplicate'),
            'stock' => $request->input('stock'), // Store the stock for the listing
            'user_id' => Auth::id(),  // Add the authenticated user's ID to the listing
        ]);

        // Redirect back with a success message
        return redirect()->route('dashboard.listings')->with('success', 'Listing created successfully!');
    }


    public function indexAll()
    {
        // Eager load the figurine with photos and the seller
        $listings = Listing::with([
            'figurine.photos' => function ($query) {
                $query->select('id', 'figurine_id', 'path');
            },
            'seller:id,name,total_sales,rating' // Select specific seller fields
        ])
            ->whereIn('status', ['available'])
            ->orderBy('created_at', 'desc') // Sort by the most recent created listings
            ->get()
            ->map(function ($listing) {
                // Add a flag to indicate if the current user is the owner
                $listing->is_owner = $listing->user_id === Auth::id();

                // Attach only the necessary seller data
                $listing->seller_info = [
                    'name' => $listing->seller->name,
                    'total_sales' => $listing->seller->total_sales,
                    'rating' => $listing->seller->rating,
                ];

                // Check if the current user has this figurine in their wishlist
                $listing->is_in_wishlist = Wishlist::where('user_id', Auth::id())
                    ->where('figurine_id', $listing->figurine_id)
                    ->exists();

                return $listing;
            });

        return Inertia::render('Marketplace/Page', [
            'listings' => $listings
        ]);
    }

    public function destroy($id)
    {
        // Fetch the listing by its ID
        $listing = Listing::findOrFail($id);

        // Ensure that the authenticated user is the one who created the listing
        if ($listing->user_id !== Auth::id()) {
            return redirect()->route('dashboard.listings')->with('error', 'You can only delete your own listings.');
        }

        // Delete the listing
        $listing->delete();

        // Redirect with a success message
        return redirect()->route('dashboard.listings')->with('success', 'Listing deleted successfully!');
    }

    public function rateUser(Request $request)
    {
        $request->validate([
            'rateable_type' => 'required|in:sale,trade',
            'rateable_id' => 'required|integer',
            'rating' => 'required|numeric|min:1|max:5',
        ]);

        $user = Auth::user();
        $type = $request->rateable_type === 'sale' ? Sale::class : Trade::class;
        $rateable = $type::findOrFail($request->rateable_id);

        // Check if already rated
        if ($rateable->is_rated) {
            return back()->withErrors('This transaction has already been rated.');
        }

        // Determine the user being rated (the other party)
        $ratee = $user->id === $rateable->buyer_id ? $rateable->seller : $rateable->buyer;

        // Update ratee's rating with rounded value to 2 decimals
        $newTotal = ($ratee->rating * $ratee->rating_count) + $request->rating;
        $ratee->rating_count += 1;
        $ratee->rating = round($newTotal / $ratee->rating_count, 2);  // Round to 2 decimals
        $ratee->save();

        // Mark this transaction as rated
        $rateable->is_rated = true;
        $rateable->save();

        return back()->with('success', 'User rated successfully!');
    }
}
