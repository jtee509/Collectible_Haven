<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        $usernames = [
            'FigurineHunter88',
            'ToyTraderX',
            'MollyMania',
            'BlindBoxQueen',
            'RareFinds',
            'CapsuleCraze',
            'PopMartMaster',
            'CollectaBuddy',
            'MiniLoots',
            'VinylVault',
            'MegaLabubu',
            'HironoHustle',
            'DIMOO_Dreams',
            'TwinkleDealer',
            'KawaiiCollector',
            'EchoVendor',
            'TinyToyBox',
            'ChopperCrate',
            'MysteryToyz',
            'SKULLMaster',
            'LabubuLover',
            'ToyBoxWizard',
            'POPStarSeller',
            'MollyCollector',
            'HironoDrop',
            'BlindBagBoss',
            'SecretDropz',
            'ToyTreasures',
            'MiniMystic',
            'FiggySeller',
            'TradeMyToys',
            'MysteryUnboxer',
            'LuckyPullz',
            'DIMOODealer',
            'KawaiiDealer',
            'POPzilla',
            'ToyWarden',
            'MiniMartian',
            'DreamyPulls',
            'LuckyLabubu',
            'BoxedFinds',
            'MysteryGuru',
            'TinyHauls',
            'TheToyDome',
            'PocketVinyls',
            'StarDropToys',
            'ToyTwist',
            'MiniBoxedUp',
            'ShinyFigurines',
            'CuratedCapsules',
            'UnboxUniverse',
            'MollyDropz',
            'CollectaCrate',
            'POPFiend',
            'RarePullMaster',
            'TwinkleStash',
            'HironoHaus',
            'ZsigaZen',
            'POPStreet',
            'ChibiCrush'
        ];

        $username = $this->faker->unique()->randomElement($usernames);
        $password = 'password'; // Default password

        // Define specific users with their passwords
        $specificUsers = [
            'FigurineHunter88' => 'testtest',
            'FiggySeller' => 'testtest',
            'CuratedCapsules' => 'testtest',
            'MiniBoxedUp' => 'testtest',
        ];

        // Check if the username is one of the specific users
        if (array_key_exists($username, $specificUsers)) {
            $password = $specificUsers[$username];
        }

        return [
            'name' => $username,
            'email' => $this->faker->unique()->safeEmail,
            'email_verified_at' => now(),
            'password' => bcrypt($password), // Use the specific password
            'remember_token' => Str::random(10),
            'total_sales' => $this->faker->numberBetween(0, 1000),
            'rating' => $this->faker->randomFloat(2, 3.5, 5), // Better ratings to reflect active sellers
            'rating_count' => $this->faker->numberBetween(0, 300),
            'bio' => $this->faker->sentence(12),
            'location' => $this->faker->city,
            'avatar' => $this->faker->imageUrl(100, 100, 'people', true),
        ];
    }}