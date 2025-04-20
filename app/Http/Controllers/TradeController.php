<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\Trade;
use App\Models\Figurine;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TradeController extends Controller
{
    // For proposing a trade from the buyer
    public function proposeTrade(Request $request, Listing $listing)
    {
        $request->validate([
            'proposed_figurine_ids' => 'required|array', // Array of figurine IDs the buyer wants to trade
            'proposed_figurine_ids.*' => 'exists:figurines,id', // Ensure each figurine exists
        ]);

        // Create the trade proposal
        $trade = Trade::create([
            'buyer_id' => Auth::id(),
            'seller_id' => $listing->user_id,
            'listing_id' => $listing->id,
            'status' => 'pending', // Status of the trade
        ]);

        // Attach multiple figurines to the trade
        $trade->figurines()->attach($request->proposed_figurine_ids);

        // Redirect to the proposed trade page with the trade ID
        return redirect()->route('trade.proposed', ['trade' => $trade->id]);
    }

    public function showTradeDashboard()
    {
        $openTrades = Trade::where('seller_id', Auth::id())
            ->whereIn('status', ['pending', 'awaiting_confirmation'])
            ->with(['figurines', 'buyer', 'listing.figurine'])
            ->get();

        return Inertia::render('Dashboard/Listing/Page', [
            'openTrades' => $openTrades,
        ]);
    }


    public function acceptTrade($tradeId)
    {
        $trade = Trade::with(['figurines', 'listing.figurine', 'listing'])->findOrFail($tradeId);

        if ($trade->seller_id !== Auth::id()) {
            return abort(403, 'Unauthorized action.');
        }

        // Only process if the trade is still pending
        if ($trade->status !== 'pending') {
            return redirect()->route('dashboard.listings')->withErrors('Trade is no longer available.');
        }

        $trade->status = 'accepted';
        $trade->save();

        DB::transaction(function () use ($trade) {
            // Transfer buyer's figurines to seller
            foreach ($trade->figurines as $figurine) {
                if ($figurine->user_id === $trade->buyer_id) {
                    $figurine->user_id = $trade->seller_id;
                    $figurine->save();
                }
            }

            $listing = $trade->listing;
            $listedFigurine = $listing->figurine;

            if ($listedFigurine) {
                // Transfer one unit to buyer
                $buyerFigurine = $listedFigurine->replicate();
                $buyerFigurine->user_id = $trade->buyer_id;
                $buyerFigurine->quantity = 1;
                $buyerFigurine->push();

                // Now reduce seller's quantity
                $listedFigurine->quantity -= 1;
                $listedFigurine->save();

                // Update listing stock
                $listing->stock -= 1;
                if ($listing->stock <= 0) {
                    $listing->status = 'traded';
                }
                $listing->save();
            }

            // Notifications
            Notification::create([
                'user_id' => $trade->seller_id,
                'type' => 'trade_accepted',
                'message' => "You accepted a trade. The figurines have been exchanged.",
            ]);

            Notification::create([
                'user_id' => $trade->buyer_id,
                'type' => 'trade_accepted',
                'message' => "Your trade offer was accepted! You received a new figurine.",
            ]);
        });

        // Redirect to success page
        return redirect()->route('dashboard.listings', ['trade' => $trade->id]);
    }


    // For the seller to reject the trade
    public function rejectTrade($tradeId)
    {
        $trade = Trade::findOrFail($tradeId);

        if ($trade->seller_id !== Auth::id()) {
            return abort(403, 'Unauthorized action.');
        }

        // Update the trade status to rejected
        $trade->status = 'rejected';
        $trade->save();

        // Redirect to trade dashboard
        return redirect()->route('dashboard.listings');
    }

    public function showProposeTradePage(Listing $listing)
    {
        $userFigurines = Figurine::with('photos:id,figurine_id,path')
            ->where('user_id', Auth::id())
            ->get();

        return Inertia::render('Marketplace/Trade/Page', [
            'listing' => $listing->load([
                'figurine.photos', // load figurine + its photos
                'seller'
            ]),
            'userFigurines' => $userFigurines,
        ]);
    }


    public function showTradeProposedPage(Trade $trade)
    {
        // Load related data for the trade, including figurines, listing, and seller
        $trade->load('figurines', 'listing', 'listing.figurine', 'listing.seller');

        // Render the trade proposed page with the trade data
        return Inertia::render('Marketplace/Trade/TradeProposed', [
            'trade' => $trade,
        ]);
    }
}
