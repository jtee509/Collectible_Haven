<?php

namespace App\Http\Controllers;

use App\Models\Figurine;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WishlistController extends Controller
{
    // Add a figurine to the user's wishlist
    public function addToWishlist($figurineId)
    {
        $user = Auth::user();
        $figurine = Figurine::findOrFail($figurineId);

        // Check if the figurine is already in the wishlist
        if ($user->wishlists->contains($figurine)) {
            return back()->with('error', 'Figurine is already in your wishlist.');
        }

        // Add figurine to wishlist
        $user->wishlists()->attach($figurine);

        return back()->with('success', 'Figurine added to your wishlist!');
    }

    // Remove a figurine from the user's wishlist
    public function removeFromWishlist($figurineId)
    {
        $user = Auth::user();
        $figurine = Figurine::findOrFail($figurineId);

        // Remove figurine from wishlist
        $user->wishlists()->detach($figurine);

        return back()->with('success', 'Figurine removed from your wishlist.');
    }

    // Display the user's wishlist using Inertia.js
    public function showWishlist()
    {
        $user = Auth::user();

        // Eager load photos for each figurine
        $wishlist = $user->wishlists()->with('photos')->get();

        return Inertia::render('Dashboard/Wishlist/Page', [
            'wishlist' => $wishlist
        ]);
    }

    public function getWishlist()
    {
        $user = Auth::user();

        // Retrieve the wishlist with figurines and their photos (eager loaded)
        $wishlist = $user->wishlists()->with('photos')->get();

        // Return the wishlist as a JSON response
        return response()->json($wishlist);
    }
}
