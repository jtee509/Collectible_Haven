<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    use HasFactory;

    // Table name (optional if the table name follows Laravel's convention)
    protected $table = 'wishlists';

    // The attributes that are mass assignable
    protected $fillable = [
        'user_id',
        'figurine_id',
    ];

    // Define the relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Define the relationship with the Figurine model
    public function figurine()
    {
        return $this->belongsTo(Figurine::class);
    }
}
