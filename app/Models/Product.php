<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'sale_price',
        'image_url',
        'stock',
        'active',
        'featured',
        'metadata'
    ];

    protected $casts = [
        'active' => 'boolean',
        'featured' => 'boolean',
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'metadata' => 'array', // Crucial para o seu BI e specs técnicas
        'stock' => 'integer'
    ];

    /**
     * Boot function para gerar o slug automaticamente no heri_amostra
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });

        static::updating(function ($product) {
            // Atualiza o slug se o nome mudar (opcional, mas bom para SEO)
            $product->slug = Str::slug($product->name);
        });
    }

    /**
     * Helper para calcular o percentual de desconto (Data Analyst logic)
     */
    public function getDiscountPercentageAttribute()
    {
        if (!$this->sale_price || $this->price <= 0) return 0;
        return round(100 - (($this->sale_price * 100) / $this->price));
    }
}