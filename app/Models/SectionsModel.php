<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SectionsModel extends Model
{
    protected $table = 'site_sections';
    
    protected $fillable = [
        'page_slug',
        'component',
        'content',
        'order',
        'is_visible'
    ];

    protected $casts = [
        'content'=> 'array',
        'is_visible' => 'boolean'
    ];
}
