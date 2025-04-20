<?php

namespace Database\Factories;

use App\Models\Listing;
use App\Models\Figurine;
use App\Models\User;
use App\Models\Photo;
use Illuminate\Database\Eloquent\Factories\Factory;

class ListingFactory extends Factory
{
    protected $model = Listing::class;

    public function definition()
    {
        $figurine = Figurine::factory()->create();  // Create a figurine

        // Create photos for the figurine (1 to 3 photos)
        $photosCount = rand(1, 3);
        for ($i = 0; $i < $photosCount; $i++) {
            Photo::factory()->create([
                'figurine_id' => $figurine->id,  // Attach the photo to the created figurine
            ]);
        }

        return [
            'figurine_id' => $figurine->id, // Attach the figurine to the listing
            'user_id' => User::factory(), // Random user
            'price' => $this->faker->randomFloat(2, 5, 1000),
            'stock' => $this->faker->numberBetween(2, 1000), // Random integer between 2 and 1000
            'is_tradeable' => $this->faker->boolean(),
            'status' => $this->faker->randomElement(['available', 'sold', 'traded']),
            'notes' => $this->faker->text(),
            'view_count' => $this->faker->numberBetween(0, 100),
        ];
    }
}
