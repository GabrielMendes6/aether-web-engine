<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\HomeSection;
use Illuminate\Database\Seeder;

class HomeSectionSeeder extends Seeder
{
    public function run(): void
    {
        // Seção 1: Banner Principal
        HomeSection::create([
            'title' => 'Banner de Boas-vindas',
            'component' => 'HeroBanner',
            'content' => [
                'title' => 'As melhores Box de Brusque',
                'image' => 'banner.jpg',
                'button_text' => 'Ver Presentes'
            ],
            'order_index' => 0
        ]);

        // Seção 2: Vitrine de Produtos
        HomeSection::create([
            'title' => 'Novidades da Semana',
            'component' => 'ProductGrid',
            'content' => [
                'category_id' => 1,
                'items_count' => 4
            ],
            'order_index' => 1
        ]);

        // Seção 3: Newsletter
        HomeSection::create([
            'title' => 'Chamada para Newsletter',
            'component' => 'NewsletterBox',
            'content' => [
                'placeholder' => 'Digite seu e-mail',
                'bg_color' => '#f3f3f3'
            ],
            'order_index' => 2
        ]);
    }
}