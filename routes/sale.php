<?php

use App\Http\Controllers\SaleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/purchase/{listing}', [SaleController::class, 'showPurchasePage'])->name('purchase.show');
Route::post('/purchase/{listing}', [SaleController::class, 'processPurchase'])->name('purchase.process');
Route::get('/purchase/success/{sale}', [SaleController::class, 'success'])->name('purchase.success');
Route::get('/purchase/failure/{sale}', function ($saleId) {
    return Inertia::render('Marketplace/Sale/PurchaseFailure', [
        'saleId' => $saleId,
    ]);
})->name('purchase.failure');
