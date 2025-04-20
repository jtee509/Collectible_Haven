<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\Figurine;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Notification;

class SaleController extends Controller
{
    public function showPurchasePage(Listing $listing)
    {
        return Inertia::render('Marketplace/Sale/Purchase', [
            'listing' => $listing->load('figurine'),
        ]);
    }

    public function processPurchase(Request $request, Listing $listing)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
            'card_number' => 'required|string',
            'expiry' => 'required|string',
            'cvc' => 'required|string',
        ]);

        $totalPrice = $listing->price * $request->quantity;

        $sale = Sale::create([
            'buyer_id' => Auth::id(), // Use buyer_id instead of user_id
            'seller_id' => $listing->user_id, // The user who created the listing is the seller
            'listing_id' => $listing->id,
            'total_price' => $totalPrice,
            'quantity' => $request->quantity,
            'status' => 'pending',
        ]);

        // Simulate card logic
        $cardNumber = str_replace(' ', '', $request->card_number); // Remove spaces just in case

        if ($cardNumber === '4242424242424242') {
            return redirect()->route('purchase.success', ['sale' => $sale->id]);
        } else {
            return redirect()->route('purchase.failure', ['sale' => $sale->id]);
        }
    }

    public function success($saleId)
    {
        try {
            // Log the incoming saleId
            Log::info("Sale ID passed to success method: " . $saleId);

            // Retrieve the sale record from the database
            $sale = Sale::with('listing.figurine')->find($saleId);

            // Check if the sale exists
            if (!$sale) {
                Log::error("Sale not found for Sale ID: " . $saleId);
            }

            // Log the retrieved sale
            Log::info("Sale found: " . $sale->id);

            // Only proceed if sale is still pending
            if ($sale->status === 'pending') {
                DB::transaction(function () use ($sale) {
                    $listing = $sale->listing;
                    $figurine = $listing->figurine;
                    $seller = $listing->seller;

                    if (!$seller) {
                        Log::error("Seller not found for listing: " . $listing->id);
                        return;
                    }

                    if (is_null($seller->total_sales)) {
                        $seller->total_sales = 0;
                    }

                    // Decrease stock by quantity purchased
                    $listing->stock -= $sale->quantity;
                    $listing->save();

                    // If no stock left, mark as sold
                    if ($listing->stock <= 0) {
                        $listing->update(['status' => 'sold']);
                    }

                    // Transfer quantity of figurines
                    $figurine->quantity = ($figurine->quantity ?? 0) - $sale->quantity;

                    // You may want to duplicate the figurine or track ownership of units here
                    // For now, we assume figurine.quantity tracks total owned
                    $figurine->save();

                    $existing = Figurine::where('user_id', $sale->buyer_id)
                        ->where('name', $figurine->name)
                        ->where('text', $figurine->text)
                        ->where('category', $figurine->category)
                        ->first();

                    if ($existing) {
                        // User already owns it → update quantity
                        $existing->quantity += $sale->quantity;
                        $existing->save();
                    } else {
                        // User doesn't own it yet → create a copy
                        $buyerFigurine = $figurine->replicate();
                        $buyerFigurine->user_id = $sale->buyer_id;
                        $buyerFigurine->quantity = $sale->quantity;
                        $buyerFigurine->push();

                        // Copy photos
                        foreach ($figurine->photos as $photo) {
                            $buyerFigurine->photos()->create([
                                'path' => $photo->path,
                            ]);
                        }
                    }

                    // Mark sale as complete
                    $sale->status = 'completed';
                    $sale->save();

                    $seller->increment('total_sales');

                    // Notifications
                    Notification::create([
                        'user_id' => $seller->id,
                        'type' => 'listing_sold',
                        'message' => "Your listing for '{$figurine->name}' has sold {$sale->quantity} unit(s)!",
                    ]);

                    Notification::create([
                        'user_id' => $sale->buyer_id,
                        'type' => 'purchase_complete',
                        'message' => "You bought {$sale->quantity}x '{$figurine->name}' for RM {$sale->total_price}.",
                    ]);
                });
            }

            // Log success and return the success page
            Log::info("Sale ID " . $saleId . " successfully processed.");
            return Inertia::render('Marketplace/Sale/PurchaseSuccess', [
                'saleId' => $saleId,
            ]);
        } catch (\Exception $e) {
            // Log the error and exception message
            Log::error("Error in SaleController success method: " . $e->getMessage());
        }
    }
}
