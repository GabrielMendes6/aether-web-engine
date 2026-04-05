<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait SanitizeData
{
    /**
     * O "Filtro de Elite": Sanitização profunda de strings.
     */
    protected function sanitizeString(?string $value): ?string
    {
        if (is_null($value)) return null;

        // 1. Decode de entidades HTML (evita bypass com &lt;script&gt;)
        $value = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        // 2. Remove TODAS as tags HTML e PHP
        $value = strip_tags($value);

        // 3. Remove caracteres de controle ASCII e Unicode ([:cntrl:])
        // Isso impede injeções de Null Byte e caracteres invisíveis que quebram o JSON
        $value = preg_replace('/[[:cntrl:]]/u', '', $value);

        // 4. Normaliza espaços (remove espaços duplos e trim)
        $value = preg_replace('/\s+/', ' ', $value);

        return trim($value);
    }

    /**
     * Sanitização Recursiva de Arrays (Ideal para o campo 'metadata').
     */
    protected function sanitizeArray(array $data): array
    {
        $clean = [];

        foreach ($data as $key => $value) {
            // Limpa a chave também para evitar ataques de Injeção de Objeto
            $cleanKey = $this->sanitizeString($key);

            if (is_array($value)) {
                $clean[$cleanKey] = $this->sanitizeArray($value);
            } elseif (is_string($value)) {
                $clean[$cleanKey] = $this->sanitizeString($value);
            } else {
                $clean[$cleanKey] = $value;
            }
        }

        return $clean;
    }

    /**
     * Normalização Financeira (Anti-erro de BI).
     * Converte "1.500,50" ou 1500.5 para 1500.50 (float puro).
     */
    protected function sanitizeCurrency($value): float
    {
        if (is_null($value)) return 0.00;

        if (is_string($value)) {
            // Remove qualquer coisa que não seja número, vírgula ou ponto
            $value = preg_replace('/[^0-9.,]/', '', $value);
            
            // Se tiver vírgula e ponto (estilo BR: 1.000,50), remove o ponto e troca vírgula por ponto
            if (str_contains($value, ',') && str_contains($value, '.')) {
                $value = str_replace('.', '', $value);
                $value = str_replace(',', '.', $value);
            } 
            // Se tiver apenas vírgula (estilo 1000,50), troca por ponto
            elseif (str_contains($value, ',')) {
                $value = str_replace(',', '.', $value);
            }
        }

        return (float) number_format((float)$value, 2, '.', '');
    }

    /**
     * Sanitização de Slugs Seguros.
     */
    protected function sanitizeSlug(string $title): string
    {
        return Str::slug($this->sanitizeString($title));
    }

    public function getSectionContent($section) {
        $config = $section->content;
        
        $query = Product::query()->where('active', true);

        switch ($config['settings']['mode']) {
            case 'featured':
                $products = $query->where('featured', true)->limit(10)->get();
                break;
            case 'category':
                $products = $query->where('category_id', $config['settings']['categoryId'])->get();
                break;
            case 'manual':
                $products = Product::whereIn('id', $config['manualProducts'])->get();
                break;
            default:
                $products = $query->inRandomOrder()->limit(8)->get();
        }

        return $products;
    }
}