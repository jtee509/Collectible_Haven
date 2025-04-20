<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trade extends Model
{
    protected $fillable = [
        'buyer_id',
        'seller_id',
        'listing_id',
        'status'
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

    public function figurines()
    {
        return $this->belongsToMany(Figurine::class, 'figurine_trade', 'trade_id', 'figurine_id');
    }

    public function figurine()
    {
        return $this->belongsTo(Figurine::class);
    }

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    // Seller of the item (the user who owns the listing)
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id'); // Corrected to be a belongsTo relation with seller_id
    }
}
