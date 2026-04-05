<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ProductService;
use App\Http\Requests\StoreProductRequest;
use Illuminate\Support\Facades\Log;


class ProductController extends Controller
{
    public function __construct(
        private ProductService $productService
    ) {}

    public function getProduct(string $slug)
    {
        try {
            $product = $this->productService->getProduct($slug);
            return response()->json($product);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::warning("Produto não encontrado: {$slug}");
            return response()->json([
                'success' => false,
                'message' => 'Produto não encontrado ou indisponível.'
            ], 404);
        }
    }

    public function allProduct() {
        $products = $this->productService->allProducts();

        if (!$products) {
            Log::warning('error');
        }

        return response()->json($products);
    }

    public function store(StoreProductRequest $request) {
        $data = $request->validated();

        $newProduct = $this->productService->createProduct($data);

        if (!$newProduct) {
            Log::warning('Nenhum Produto Criado.');
        }

        return response()->json([
            'success' => true,
            'message' => 'Produto criado com sucesso!',
            'Product' => $newProduct,
        ], 201);
    }

    public function index(Request $request) {
        $settings = [
            'mode' => $request->query('mode', 'random'),
            'categoryId' => $request->query('category_id'),
            'limit' => $request->query('limit', 8),
        ];

        $products = $this->productService->getProductsByMode($settings);

        return response()->json([
            'success' => true,
            'products' => $products
        ]);
    }
}
