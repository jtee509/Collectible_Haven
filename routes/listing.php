<?php

use Inertia\Inertia;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\WishlistController;  // Add the appropriate controller if you have one
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // Route to show the Inertia listing page
    Route::get('/dashboard/listings', [ListingController::class, 'index'])->name('dashboard.listings');
    Route::post('dashboard/listing/store', [ListingController::class, 'store'])->name('dashboard.listing.store');
    Route::post('dashboard/listing/{id}/destroy', [ListingController::class, 'destroy'])->name('dashboard.listing.destroy');

    Route::post('/wishlist/{figurineId}/add', [WishlistController::class, 'addToWishlist'])->name('wishlist.add');
    Route::post('/wishlist/{figurineId}/remove', [WishlistController::class, 'removeFromWishlist'])->name('wishlist.remove');
    Route::get('/dashboard/wishlist', [WishlistController::class, 'showWishlist'])->name('dashboard.wishlist');
    Route::post('/dashboard/rate-user', [ListingController::class, 'rateUser'])->name('dashboard.rate.user');
    Route::get('/wishlist', [WishlistController::class, 'getWishlist'])->middleware('auth');
});
