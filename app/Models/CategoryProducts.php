<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\product;

class CategoryProducts extends Model
{
    protected $table = 'category_products';

    protected $fillable = [
        'name',
        'slug',
        'active'
    ];

    public function products(): HasMany {
        return $this->hasMany(Product::class);
    }
}
