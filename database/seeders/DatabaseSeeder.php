<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Listing;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Listing::factory()->count(20)->create();
    }
}
