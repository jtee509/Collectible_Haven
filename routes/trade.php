<?php

use App\Http\Controllers\TradeController;
use Illuminate\Support\Facades\Route;

// Propose trade page (GET)
Route::get('/listing/{listing}/trade', [TradeController::class, 'showProposeTradePage'])
    ->middleware(['auth'])
    ->name('trade.propose.page');

// Submit trade proposal (POST)
Route::post('/listing/{listing}/trade', [TradeController::class, 'proposeTrade'])
    ->middleware(['auth'])
    ->name('trade.propose');

// Seller trade dashboard (GET)
Route::get('/dashboard/trades', [TradeController::class, 'showTradeDashboard'])
    ->middleware(['auth'])
    ->name('trade.dashboard');

// Accept a trade (POST or PUT)
Route::post('/trades/{trade}/accept', [TradeController::class, 'acceptTrade'])
    ->middleware(['auth'])
    ->name('trade.accepted');

// Reject a trade (POST or PUT)
Route::post('/trades/{trade}/reject', [TradeController::class, 'rejectTrade'])
    ->middleware(['auth'])
    ->name('trade.rejected');

// Trade proposal confirmation page (GET)
Route::get('/trades/{trade}/proposed', [TradeController::class, 'showTradeProposedPage'])
    ->middleware(['auth'])
    ->name('trade.proposed');
