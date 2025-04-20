<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();

            // Buyer of the item
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');

            // Seller of the item
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');

            // Listing being purchased
            $table->foreignId('listing_id')->constrained()->onDelete('cascade');

            // Quantity and total cost
            $table->integer('quantity')->default(1);
            $table->decimal('total_price', 8, 2);

            // Sale status
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');

            // Rating flag
            $table->boolean('is_rated')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
