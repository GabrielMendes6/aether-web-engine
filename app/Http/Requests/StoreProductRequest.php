<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Como é um projeto piloto, por enquanto retornamos true. 
        // No futuro, aqui checaremos se o usuário é o Admin.
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => 'nullable|exists:category_products,id',
            'name'        => 'required|string|max:255',
            'slug'        => [
                'nullable', 
                'string', 
                'max:255', 
                Rule::unique('products', 'slug')->ignore($this->product)
            ],
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'sale_price'  => 'nullable|numeric|min:0|lt:price', // Deve ser menor que o preço original
            'image_url'   => 'nullable|url',
            'stock'       => 'required|integer|min:0',
            'active'      => 'boolean',
            'metadata'    => 'nullable|array',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'     => 'O nome do produto é obrigatório.',
            'price.required'    => 'Um produto sem preço não gera faturamento.',
            'sale_price.lt'     => 'O preço de promoção deve ser menor que o preço original.',
            'slug.unique'       => 'Este slug já está em uso por outro produto.',
            'stock.integer'     => 'O estoque deve ser um número inteiro.',
            'image_url.url'     => 'A URL da imagem parece ser inválida.',
            'category_id.exists' => 'Essa categoria não foi encontrada no nosso banco.',
            'featured.boolean'   => 'O campo destaque deve ser verdadeiro ou falso.'
        ];
    }
}