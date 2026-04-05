<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HomeSection;

class HomeSectionController extends Controller
{
    public function index()
    {
        // Buscamos todas as seções...
        return HomeSection::where('is_visible', true)
            ->orderBy('order_index', 'asc') // ...ordenadas do menor para o maior (0, 1, 2...)
            ->get();
    }

    public function update(Request $request, HomeSection $homeSection)
    {
        $data = $request->validate([
            'title'      => 'sometimes|string',
            'content'    => 'sometimes|array', 
            'is_visible' => 'sometimes|boolean',
        ]);

        if ($request->has('content')) {
            // Combinamos o que já existe no banco com o que chegou agora
            $data['content'] = array_merge($homeSection->content ?? [], $request->input('content'));
        }

        $homeSection->update($data);

        return response()->json([
            'success' => true,
            'data'    => $homeSection->fresh()
        ]);
    }

    public function reorder(Request $request)
    {
        $data = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:home_sections,id'
        ]);

        // Usamos DB::transaction para garantir que ou MUDA TUDO ou NÃO MUDA NADA
        \DB::transaction(function () use ($data) {
            foreach ($data['ids'] as $index => $id) {
                HomeSection::where('id', $id)
                    // ->where('user_id', auth()->id()) // Descomente quando adicionar o user_id
                    ->update(['order_index' => $index]);
            }
        });

        return response()->json(['success' => true]);
    }
}
