<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('home_sections', function (Blueprint $table) {
            $table->id();
            $table->string('title');       // Nome interno (ex: "Banner Principal")
            $table->string('component');   // Nome do componente no React (ex: "HeroSection")
            $table->json('content');       // Textos, links de imagens, etc.
            $table->integer('order_index')->default(0); // A chave para a reordenação
            $table->boolean('is_visible')->default(true);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('home_sections');
    }
};
