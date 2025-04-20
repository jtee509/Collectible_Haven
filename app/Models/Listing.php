<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    use HasFactory;

    protected $fillable = [
        'figurine_id',
        'user_id',
        'price',
        'is_tradeable',
        'status',
        'notes',
        'stock',
    ];

    public function figurine()
    {
        return $this->belongsTo(Figurine::class);
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function photos()
    {
        return $this->hasMany(Photo::class);
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function trades()
    {
        return $this->hasMany(Trade::class);
    }
}
