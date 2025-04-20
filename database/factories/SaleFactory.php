<?php

namespace Database\Factories;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SaleFactory extends Factory
{
    protected $model = \App\Models\Sale::class;

    public function definition()
    {
        return [
            'buyer_id' => User::factory(), // Random buyer user
            'seller_id' => User::factory(), // Random seller user
            'listing_id' => Listing::factory(), // Random listing
            'quantity' => $this->faker->numberBetween(1, 5), // Random quantity
            'total_price' => $this->faker->randomFloat(2, 5, 1000), // Random price
            'status' => $this->faker->randomElement(['pending', 'completed', 'cancelled']),
            'is_rated' => $this->faker->boolean(), // Whether it's rated or not
        ];
    }
}
