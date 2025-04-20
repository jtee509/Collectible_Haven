<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('figurines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // owner
            $table->string('text')->nullable();
            $table->enum('name', [
                'Hirono',
                'Dimoo',
                'Molly'
            ])->nullable();
            $table->text('description')->nullable();
            // Change category field to enum
            $table->enum('category', [
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
            ])->nullable();
            // Change rarity field to boolean
            $table->boolean('rarity')->default(false);
            $table->decimal('price', 8, 2)->nullable();
            $table->date('purchase_date')->nullable();
            $table->enum('condition', [
                'new',
                'used'
            ])->nullable();
            $table->boolean('is_tradeable')->default(false);
            $table->boolean('is_duplicate')->default(false);
            $table->boolean('is_locked')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('figurines');
    }
};
