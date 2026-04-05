<?php


namespace Database\Seeders;


use Illuminate\Database\Seeder;

use App\Models\SectionsModel;


class SectionsSeeder extends Seeder

{

    public function run()
    {

        // Limpa a tabela para não duplicar se rodar de novo

        SectionsModel::where('page_slug', 'home')->delete();


        // 1. Hero Section

        SectionsModel::create([

            'page_slug' => 'home',

            'component' => 'HeroSection',

            'order' => 0,

            'is_visible' => true,

            'content' => [

                'title' => 'Bem-vindo à Heri Amostra',

                'subtitle' => 'O seu portal de vendas unificado com a precisão do Jarvis.',

                'cta_text' => 'Começar Agora',

                'bg_image' => 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070'

            ]

        ]);


        // 2. Product Grid

        SectionsModel::create([

            'page_slug' => 'home',

            'component' => 'ProductGrid',

            'order' => 1,

            'is_visible' => true,

            'content' => [

                'title' => 'Produtos em Destaque',

                'description' => 'Confira as melhores ofertas selecionadas para você.'

            ]

        ]);


        $this->command->info('Jarvis: Seções da Home criadas com sucesso!');

    }

}