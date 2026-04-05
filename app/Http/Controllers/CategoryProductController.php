<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CategoryProducts;
use App\Traits\SanitizeData;
use Illuminate\Support\Str;

class CategoryProductController extends Controller
{
    use SanitizeData;

    public function store(Request $request)
    {
        // 1. Validação básica
        $request->validate([
            'name' => 'required|string|max:255|unique:category_products,name',
        ]);

        // 2. Sanitização e Preparação
        $name = $this->sanitizeString($request->name);
        
        $data = [
            'name'   => $name,
            'slug'   => Str::slug($name), // Gera o slug a partir do nome limpo
            'active' => $request->boolean('active', true),
        ];

        try {
            $category = CategoryProducts::create($data);

            return response()->json([
                'message' => 'Categoria criada com sucesso!',
                'category' => $category
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao criar categoria',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        return response()->json(
            CategoryProducts::where('active', true)->select('id', 'name')->get()
        );
    }
}
