<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration {
    public function up(): void
    {
        Schema::table('figurines', function (Blueprint $table) {
            $table->dropColumn('is_duplicate');
            $table->integer('quantity')->default(1); // or name it 'stock' if you prefer
        });
    }

    public function down(): void
    {
        Schema::table('figurines', function (Blueprint $table) {
            $table->boolean('is_duplicate')->default(false);
            $table->dropColumn('quantity');
        });
    }
};
