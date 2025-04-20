<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Figurine extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'text',
        'description',
        'quantity',
        'category',
        'rarity',
        'price',
        'purchase_date',
        'condition',
        'is_tradeable',
        'is_locked',
    ];

    protected $casts = [
        'is_tradeable' => 'boolean',
        'purchase_date' => 'date',
    ];

    public static function categories(): array
    {
        return [
            'MEGA 400%',
            'Bag',
            'Figurine',
            'Blind Box',
            'Pendant Blind Box',
            'Plush Dolls',
            'MEGA 1000%',
            'Fridge Magnet',
            'Phone Accessories',
            'Others',
            'Cotton Doll',
            'Cable Blind Box',
            'Action Figure',
            'Earphone Storage',
            'Cup',
            'Badge'
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function photos()
    {
        return $this->hasMany(Photo::class);
    }

    public function listing()
    {
        return $this->hasOne(Listing::class);
    }

    public function trades()
    {
        return $this->belongsToMany(Trade::class, 'figurine_trade', 'figurine_id', 'trade_id');
    }

    public function wishlistedBy()
    {
        return $this->belongsToMany(User::class, 'wishlists');
    }
}
