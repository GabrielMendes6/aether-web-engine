<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeSection extends Model
{
    public function up(): void {
        Schema::create('home_sections', function (Blueprint $table) {
            $table->id();
            $table->string('component'); // Ex: HeroBanner, ProductGrid, ContactForm
            $table->json('content');          // Onde a mágica acontece (textos, imagens, cores)
            $table->integer('order_index')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->timestamps();
        });
    }

    // Campos que permitimos que o Laravel escreva no banco
    protected $fillable = [
        'title',
        'component',
        'content',
        'order_index',
        'is_visible'
    ];

    protected $casts = [
        'content' => 'array',
        'is_visible' => 'boolean' // Corrigido de 'boolen'
    ];
}
