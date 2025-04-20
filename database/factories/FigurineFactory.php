<?php

namespace Database\Factories;

use App\Models\Figurine;
use App\Models\User;
use App\Models\Photo;
use Illuminate\Database\Eloquent\Factories\Factory;

class FigurineFactory extends Factory
{
    protected $model = Figurine::class;

    public function definition()
    {
        $texts = [
            'MEGA SPACE MOLLY 1000% Jon Burgerman',
            'TINYTINY- Secret Plan',
            'TINYTINY - A New Story',
            'Twinkle Twinkle Be a Little Star Series Figures',
            'Twinkle Twinkle Be a Little Star Series - Plush Pendant Blind Box',
            'MEGA LABUBU 400% TONY TONY CHOPPER',
            'Twinkle Twinkle Be a Little Star Series-Mini Bag Pendant Blind Box',
            'POP BEAN Pajama Party earphone bag',
            'POP BEAN Pajama Party mobile phone chain',
            'Twinkle Twinkle Be a Little Star Series-Phone Case for iPhone',
            'Zsiga Walking Into The Forest Series Blocks',
            'Twinkle Twinkle Classic Series-Goodnight Pat-activated Lamp',
            'Twinkle Twinkle Be a Little Star Series-Plush Handbooks',
            'POP BEAN Pajama Party Series-Decoration Charm Set',
            'POP BEAN Pajama Party plush cloud night light',
            'Twinkle Twinkle Be a Little Star Series-Tote Bag',
            'POP BEAN Pajama Party Twinkle silicone crossbody bag',
            'POP BEAN Pajama Hand Puppet Series Box Set',
            'DIMOO Earth Day Figure',
            'We are Twinkle Twinkle Series-Plush Pendant Blind Box',
            'MEGA LABUBU 1000% TONY TONY CHOPPER',
            'Hirono Echo Series Figures',
            'Hirono × Snoopy Figure',
            'SKULLPANDA × HAMCUS 1/6 Action Figure',
            'Hirono Echo Series - Mini Bag Blind Box',
            'SpongeBob Best Friends Series Figures',
            'Baby Molly × Pingu Happy Fishing Series-Vinyl Plush Pendant Blind Box',
            'Hirono Echo Series - Pendant Chain Blind Box',
            'Hirono Echo Series - Fridge Magnet Clip Blind Box',
            'Hirono Echo Series-Phone Case',
            'POP BEAN DIMOO WORLD × DISNEY Classic Series（3Pcs Per Pack）',
            'Hirono Echo Series-2 in 1 Cable Blind Box',
            'CRYBABY CHEER UP, BABY! SERIES-Plush Pendant Blind Box',
            'Finding MOKOKO Series Figures',
            'Teletubbies Companion Series Figures',
            'Hirono Echo Series - Passport Bag',
            'POP MART 100% Assemblable Lighted Display Container',
            'POP MART 400% Assemblable Lighted Display Container',
            'Hirono Doll Panda Figure',
            'MEGA SPACE MOLLY Optimus Prime《IN SPACE》3D Painting',
            'MEGA SPACE MOLLY 400% Optimus Prime',
            'SKULLPANDA The Mirage Series Figures',
            'SKULLPANDA The Mirage Series Breastpin',
            'SKULLPANDA The Mirage Series Phone Chain',
            'SKULLPANDA The Mirage Series Shoulder Bag',
            'SKULLPANDA The Mirage Series Phone Case',
            'SKULLPANDA The Mirage Series Handbag',
            'SKULLPANDA The Mirage Series Mini Bag',
            'MEGA SPACE MOLLY 1000% OPTIMUS PRIME',
            'LABUBU Lemon Tea Figure',
            'PUCKY BEANIE BUBBLE UP SERIES-Plush Pendant Blind Box',
            'Disney Princess\'s Fairy Tales Series Scene Sets',
            'Ted2  Teddy Bear  Action Plush Pendant',
            'Zsiga Cherry Blossoms\' Gift to the Earth Figure',
            'PINO JELLY Cherry Blossom Academy Figure',
            'SPY×FAMILY Anya\'s Secret Society Series Plush Toy',
            'MEGA JUST DIMOO 1000% Mickey Mouse',
            'DIMOO WORLD × DISNEY Series Figures',
            'Teletubbies Vibrancy Series Figures',
            'DIMOO WORLD × DISNEY Series-Vinyl Plush Keychain Blind Box',
            'DIMOO WORLD × DISNEY Series-Fridge Magnet Blind Box',
            'DIMOO WORLD × DISNEY Series-Mickey Vinyl Plush Bag',
            'MEGA JUST DIMOO 400% Mickey Mouse',
            'DIMOO MICKEY 1/8 Action Figure',
            'DIMOO WORLD × DISNEY Series-Storage Bag Blind Box',
            'DIMOO WORLD × DISNEY Series-TV Set Luminous Display Container',
            'DIMOO WORLD × DISNEY Series-Earphone Case for Airpods Pro',
            'DIMOO WORLD × DISNEY Series-Phone Charm Blind Box',
            'DIMOO WORLD × DISNEY Series-2 in 1 Cable Blind Box',
            'DIMOO WORLD × DISNEY Series-Phone Case',
            'Zsiga The Window Series Scene Sets'
        ];

        return [
            'user_id' => User::factory(),
            'text' => $this->faker->randomElement($texts),
            'name' => $this->faker->randomElement(['Hirono', 'Dimoo', 'Molly']),
            'description' => $this->faker->paragraph,
            'category' => $this->faker->randomElement([
                'MEGA 400%',
                'Bag',
                'Figurine',
                'Blind Box',
                'Pendant Blind Box',
                'Plush Dolls',
                'MEGA 1000%',
                'Fridge Magnet',
                'Phone Accessories',
                'Others',
                'Cotton Doll',
                'Cable Blind Box',
                'Action Figure',
                'Earphone Storage',
                'Cup',
                'Badge'
            ]),
            'rarity' => $this->faker->numberBetween(0, 1),
            'price' => $this->faker->randomFloat(2, 5, 100),
            'purchase_date' => $this->faker->date(),
            'condition' => $this->faker->randomElement(['new', 'used']),
            'is_tradeable' => $this->faker->boolean(),
            'is_locked' => $this->faker->boolean(),
            'quantity' => $this->faker->numberBetween(1, 100),
        ];
    }
    public function configure()
    {
        return $this->afterCreating(function (Figurine $figurine) {
            // Choose 1-3 random photos from the available images
            $count = rand(1, 3);

            // Attach randomly chosen photos
            for ($i = 0; $i < $count; $i++) {
                // Create a photo for the figurine, using the PhotoFactory
                $photo = Photo::factory()->create([
                    'figurine_id' => $figurine->id,
                ]);
            }
        });
    }
}
