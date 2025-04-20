<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'total_sales',
        'rating',
        'rating_count',
        'bio',
        'location',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function figurines()
    {
        return $this->hasMany(Figurine::class); // Assuming 'figurine' is the name of the related model
    }

    public function listings()
    {
        return $this->hasMany(Listing::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'seller_id');
    }

    // User.php

    public function sales()
    {
        // As a seller, we fetch sales via listings
        return $this->hasManyThrough(
            Sale::class,
            Listing::class,
            'user_id',    // Foreign key on listings table (seller_id)
            'listing_id', // Foreign key on sales table
            'id',         // Local key on users table
            'id'          // Local key on listings table
        );
    }

    public function wishlists()
    {
        return $this->belongsToMany(Figurine::class, 'wishlists');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}
