<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('site_sections', function (Blueprint $table) {
            $table->id();
            $table->string('page_slug'); // ex: 'home', 'about', 'pricing'
            $table->string('component'); // ex: 'HeroSection', 'ProductGrid'
            $table->json('content'); // Aqui guardamos títulos, imagens e textos
            $table->integer('order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_sections');
    }
};
