<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    use HasFactory;

    protected $fillable = ['figurine_id', 'path'];

    public function figurine()
    {
        return $this->belongsTo(Figurine::class);
    }

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }
}
