<?php

namespace App\Services;

use App\Models\Product;
use App\Traits\SanitizeData;

class ProductService
{
    use SanitizeData;

    public function __construct()
    {
        //
    }

    public function createProduct(array $data): Product 
    {
       $sanitazed = [
        
            'category_id' => $data['category_id'] ?? null,
            'name' => $this->sanitizeString($data['name']),
            'featured'    => (bool) ($data['featured'] ?? false),
            'description' => $this->sanitizeString($data['description'] ?? ''),
            'price' => $this->sanitizeCurrency($data['price']),
            'sale_price' => isset($data['sale_price']) ? $this->sanitizeCurrency($data['sale_price']) : null,
            'stock' => (int) ($data['stock'] ?? 0 ),
            'active' => (bool) ($data['active'] ?? true),
            'image_url' => filter_var($data['image_url'] ?? '', FILTER_SANITIZE_URL),
            'metadata' => $this->sanitizeArray($data['metadata'] ?? [])
       ];

       $sanitazed['slug'] = $this->sanitizeSlug($data['slug'] ?? $sanitazed['name']);

        // 5. Persistência
        return Product::create($sanitazed);
    }

    public function getProduct(string $slug) {
        return Product::where('slug', $slug)
            ->where('active', true)
            ->firstOrFail();
    }

    public function allProducts() {
        return Product::where('active', true)->get();
    }

    public function getProductsByMode(Array $settings) {
        $mode = $settings['mode'] ?? 'random';
        $limit = $settings['limit'] ?? 8;
        $categoryId = $settings['categoryId'];

        $query = Product::where('active', true);

        switch($mode) {
            case 'featured':
                $query->where('featured', true);
                break;

            case 'category':
                if ($categoryId) {
                    $query->where('category_id', $categoryId);
                }

            case 'ramdom':
            default:
                $query->inRandomOrder();
                break;
        }

        return $query->limit($limit)->get();
    }
}
