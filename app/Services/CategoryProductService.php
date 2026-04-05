<?php

namespace App\Services;

use App\Models\Product;
use App\Traits\SanitizeData;

class ProductService
{
    use SanitizeData;

    public function getProductsByMode(array $settings, array $manualIds = [])
    {
        $mode = $settings['mode'] ?? 'random';
        $limit = $settings['limit'] ?? 8;

        $query = Product::active();

        switch ($mode) {
            case 'featured':
                $query->featured();
                break;

            case 'category':
                if (!empty($settings['categoryId'])) {
                    $query->where('category_id', $settings['categoryId']);
                }
                break;

            case 'manual':
                if (!empty($manualIds)) {
                    // Mantém a ordem exata que o ADM escolheu
                    return Product::whereIn('id', $manualIds)
                        ->orderByRaw("FIELD(id, " . implode(',', $manualIds) . ")")
                        ->get();
                }
                break;

            case 'random':
            default:
                $query->inRandomOrder();
                break;
        }

        return $query->limit($limit)->get();
    }
}