<?php

namespace App\Http\Controllers;

use App\Models\Figurine;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class FigurineController extends Controller
{

    public function index()
    {
        // Fetch figurines with their photos, but select only the `path` of the photos
        $figurines = Figurine::with('photos:id,figurine_id,path')
            ->where('user_id', Auth::id())
            ->get()
            ->filter(function ($figurine) {
                // If quantity is 0, delete the figurine and skip it
                if ($figurine->quantity == 0) {
                    $figurine->delete();
                    return false;
                }

                // Check if the figurine has an active listing
                $hasActiveListing = DB::table('listings')
                    ->where('figurine_id', $figurine->id)
                    ->whereIn('status', ['available', 'traded'])
                    ->exists();


                // Check if the figurine is involved in an active trade
                $hasActiveTrade = DB::table('trades')
                    ->whereIn('listing_id', function ($query) use ($figurine) {
                        $query->select('id')
                            ->from('listings')
                            ->where('figurine_id', $figurine->id);
                    })
                    ->whereIn('status', ['pending', 'accepted'])
                    ->exists();

                // Set `is_locked` to 1 if either there is an active listing or an active trade
                $figurine->is_locked = $hasActiveListing || $hasActiveTrade;

                // Log the figurine is_locked value before saving it
                Log::info("Figurine is_locked value: ", [
                    'figurine_id' => $figurine->id,
                    'is_locked' => $figurine->is_locked,
                ]);

                // Save the changes to the database
                $figurine->save();

                return $figurine;
            });

        // Fetch the wishlist for the authenticated user
        $wishlist = Wishlist::where('user_id', Auth::id())->pluck('figurine_id')->toArray();

        // Return the figurines and wishlist to the frontend
        return Inertia::render('Dashboard/Page', [
            'figurines' => $figurines,
            'wishlist' => $wishlist, // Pass wishlist data to the frontend
        ]);
    }


    public function store(Request $request)
    {
        // Convert boolean fields from string to actual booleans
        $request->merge([
            'is_tradeable' => $request->boolean('is_tradeable'),
            'rarity' => $request->boolean('rarity'),

        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'text' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'required|integer',
            'category' => 'required|string|max:100',
            'rarity' => 'required|boolean',
            'price' => 'required|numeric',
            'is_tradeable' => 'nullable|boolean',
            'photos.*' => 'nullable|image|max:2048',
        ]);

        $figurine = Figurine::create([
            'name' => $validated['name'],
            'text' => $validated['text'] ?? null,
            'description' => $validated['description'] ?? null,
            'quantity' => $validated['quantity'],
            'category' => $validated['category'],
            'rarity' => $validated['rarity'],
            'price' => $validated['price'],
            'is_tradeable' => $validated['is_tradeable'],
            'user_id' => Auth::id(),
        ]);

        if ($request->file('photos')) {
            foreach ($request->file('photos') as $photo) {
                if ($photo) {
                    $path = $photo->store('images/figures', 'public');
                    $figurine->photos()->create(['path' => $path]);
                }
            }
        }

        return redirect()->route('dashboard')->with('success', 'Figurine added successfully.');
    }

    public function edit(Figurine $figurine)
    {
        // Ensure the logged-in user owns the figurine
        if ($figurine->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        // Fetch the figurine with related photos (use findOrFail to get a single figurine)
        $figurine = Figurine::with('photos:id,figurine_id,path')->where('user_id', Auth::id())->findOrFail($figurine->id);

        // Pass the figurine to the Inertia view
        return Inertia::render('Dashboard/EditFig/Page', [
            'figurine' => $figurine,
        ]);
    }


    public function update(Request $request, Figurine $figurine)
    {
        if ($figurine->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        // Convert boolean fields from string to actual booleans
        $request->merge([
            'is_tradeable' => $request->boolean('is_tradeable'),
            'rarity' => $request->boolean('rarity'),

        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'text' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'required|integer',
            'category' => 'required|string|max:100',
            'rarity' => 'required|boolean',
            'price' => 'required|numeric',
            'condition' => 'nullable|string|max:255',
            'purchase_date' => 'nullable|date',
            'is_tradeable' => 'nullable|boolean',
            'photos.*' => 'nullable|image|max:2048',
            'existing_photos' => 'nullable|array',
            'existing_photos.*' => 'exists:photos,id',
        ]);

        $figurine->update([
            'name' => $validated['name'],
            'text' => $validated['text'],
            'description' => $validated['description'] ?? null,
            'quantity' => $validated['quantity'],
            'category' => $validated['category'],
            'rarity' => $validated['rarity'],
            'price' => $validated['price'],
            'condition' => $validated['condition'] ?? null,
            'purchase_date' => $validated['purchase_date'] ?? null,
            'is_tradeable' => $validated['is_tradeable'],
        ]);

        // Handle existing photos - delete any that weren't included in existing_photos
        if ($request->has('existing_photos')) {
            $photosToKeep = $request->input('existing_photos');

            $figurine->photos()
                ->whereNotIn('id', $photosToKeep)
                ->each(function ($photo) {
                    if (Storage::disk('public')->exists($photo->path)) {
                        Storage::disk('public')->delete($photo->path);
                    }
                    $photo->delete();
                });
        } else {
            $figurine->photos()->each(function ($photo) {
                if (Storage::disk('public')->exists($photo->path)) {
                    Storage::disk('public')->delete($photo->path);
                }
                $photo->delete();
            });
        }

        // Handle new photos
        if ($request->file('photos')) {
            foreach ($request->file('photos') as $photo) {
                if ($photo) {
                    $path = $photo->store('images/figures', 'public');
                    $figurine->photos()->create(['path' => $path]);
                }
            }
        }

        return redirect()->route('dashboard')->with('success', 'Figurine updated successfully.');
    }


    public function getCategoryStatistics()
    {
        $userId = Auth::id();

        // Category distribution
        $statistics = Figurine::where('user_id', $userId)
            ->select('category', DB::raw('count(*) as count'))
            ->groupBy('category')
            ->get();

        // Total figurines count
        $total = Figurine::where('user_id', $userId)->count();

        // Name-based distribution for pie chart
        $nameDistribution = Figurine::where('user_id', $userId)
            ->whereIn('name', ['Molly', 'Hirono', 'Dimoo'])
            ->select('name', DB::raw('count(*) as count'))
            ->groupBy('name')
            ->get();

        return Inertia::render('Dashboard/Statistics/Page', [
            'statistics' => $statistics,
            'total' => $total,
            'nameDistribution' => $nameDistribution
        ]);
    }


    public function destroy(Figurine $figurine)
    {
        if ($figurine->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $listingIds = DB::table('listings')
            ->where('figurine_id', $figurine->id)
            ->pluck('id');

        $activeListing = DB::table('listings')
            ->where('figurine_id', $figurine->id)
            ->whereIn('status', ['available', 'traded'])
            ->exists();

        $activeTrade = DB::table('trades')
            ->whereIn('listing_id', $listingIds)
            ->whereIn('status', ['pending', 'accepted'])
            ->exists();

        if ($activeListing || $activeTrade) {
            return redirect()->route('dashboard')->with('error', 'This figurine cannot be deleted because it has an active listing or is being offered in a trade.');
        }

        foreach ($figurine->photos as $photo) {
            if (Storage::disk('public')->exists($photo->path)) {
                Storage::disk('public')->delete($photo->path);
            }
        }

        $figurine->photos()->delete();
        $figurine->delete();

        return redirect()->route('dashboard')->with('success', 'Figurine deleted successfully.');
    }
}
