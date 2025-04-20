<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    // The table associated with the model.
    protected $table = 'notifications';

    // The attributes that are mass assignable.
    protected $fillable = [
        'user_id',
        'type',
        'message',
        'is_read',
    ];

    // Casts for certain attributes.
    protected $casts = [
        'is_read' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Define the relationship between Notification and User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
