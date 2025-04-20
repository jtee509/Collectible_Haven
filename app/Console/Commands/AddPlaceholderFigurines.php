<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Figurine;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class AddPlaceholderFigurines extends Command
{
    protected $signature = 'figurines:add-placeholders {--count=5}';

    protected $description = 'Add placeholder figurines with dummy data and photos';

    public function handle()
    {
        // Temporarily turn off foreign key constraints for SQLite
        DB::statement('PRAGMA foreign_keys=OFF');

        $count = $this->option('count');
        $categories = ['Fantasy', 'Sci-Fi', 'Historical', 'Cute', 'Action'];
        $rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary']; // Valid rarity values

        for ($i = 1; $i <= $count; $i++) {
            $figurine = Figurine::create([
                'name' => 'Placeholder Figurine ' . $i,
                'details' => 'This is a description for figurine ' . $i,
                'category' => $categories[array_rand($categories)],
                'rarity' => $rarities[array_rand($rarities)], // Ensure this value is valid
                'price' => rand(10, 200),
                'tradeable' => (bool)random_int(0, 1),
                'photo' => 'https://via.placeholder.com/150?text=Figurine+' . $i,
            ]);

            $this->info("Added: {$figurine->name}");
        }

        // Reactivate foreign key constraints for SQLite
        DB::statement('PRAGMA foreign_keys=ON');

        $this->info("✅ $count placeholder figurines added successfully.");
    }
}
