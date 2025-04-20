<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FigurineController;
use App\Http\Controllers\ListingController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [ListingController::class, 'indexAll']);

Route::middleware(['auth', 'verified', 'web'])->group(function () {
    Route::get('/dashboard', [FigurineController::class, 'index'])->name('dashboard');
});

Route::get('/dashboard/add', function () {
    return Inertia::render('Dashboard/AddFig/Page');
})->middleware(['auth', 'verified'])->name('dashboard.add');

Route::get('/dashboard/ai', function () {
    return Inertia::render('Dashboard/AI/Page');
})->middleware(['auth', 'verified'])->name('dashboard.ai');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard/{figurine}/edit', [FigurineController::class, 'edit'])->name('dashboard.edit');
});

Route::middleware('auth')->group(function () {
    Route::post('/figurines/add', [FigurineController::class, 'store'])->name('figurines.store');
    Route::post('/figurines/{figurine}', [FigurineController::class, 'update'])->name('figurines.update');
    Route::post('/figurines/{figurine}/delete', [FigurineController::class, 'destroy'])->name('figurines.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/dashboard/statistics', [FigurineController::class, 'getCategoryStatistics'])
    ->middleware(['auth', 'verified'])->name('dashboard.statistics');


require __DIR__ . '/auth.php';
require __DIR__ . '/listing.php';
require __DIR__ . '/sale.php';
require __DIR__ . '/trade.php';
require __DIR__ . '/notification.php';
