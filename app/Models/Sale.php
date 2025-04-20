<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    // Updated $fillable to include 'buyer_id' and 'seller_id'
    protected $fillable = [
        'buyer_id', // Buyer (user making the purchase)
        'seller_id', // Seller (user who owns the listing)
        'listing_id', // Listing that was sold
        'quantity', // Quantity of items sold
        'total_price', // Total price of the sale
        'status', // Sale status ('pending', 'completed', 'cancelled')
        'is_rated', // Whether the sale has been rated
    ];

    protected $casts = [
        'is_rated' => 'boolean',
    ];

    // Buyer of the sale (user who made the purchase)
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    // The listing that was sold
    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

    // Seller of the item (the user who owns the listing)
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id'); // Corrected to be a belongsTo relation with seller_id
    }
}
