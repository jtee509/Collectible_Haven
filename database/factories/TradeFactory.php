<?php

namespace Database\Factories;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TradeFactory extends Factory
{
    protected $model = \App\Models\Trade::class;

    public function definition()
    {
        return [
            'buyer_id' => User::factory(), // Random buyer user
            'seller_id' => User::factory(), // Random seller user
            'listing_id' => Listing::factory(), // Random listing
            'status' => $this->faker->randomElement(['pending', 'accepted', 'rejected', 'completed']),
            'is_rated' => $this->faker->boolean(), // Whether it's rated or not
        ];
    }
}
