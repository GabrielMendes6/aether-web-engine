<?php 

namespace App\Services;

use Illuminate\Http\UploadedFile; 
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\SectionsModel;
use Illuminate\Support\Facades\DB;

class SectionService
{

    /**
     * Cria seções
     */
    public function createSection(array $data) {
        $lastOrder = SectionsModel::where('page_slug', $data['page_slug'])->max('order');

        return SectionsModel::create([
            'page_slug' => $data['page_slug'],
            'component' => $data['component'],
            'content' => $data['content'],
            'order' => ($lastOrder !== null) ? $lastOrder + 1 : 0,
            'is_visible' => true
        ]);
    }

    /**
     * Processa o upload de um arquivo para o storage público.
     * * @param UploadedFile $file
     * @param string $folder
     * @return string URL completa do arquivo
     */

    public function uploadFiles(UploadedFile $file, string $folder = 'sections'): string
    {
        // Gera um nome único para evitar sobrescrita
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

        // Salva o arquivo no disco 'public'
        $path = $file->storeAs($folder, $filename, 'public');

        // Retorna a URL absoluta para o frontend (Ex: http://seu-dominio.com/storage/sections/uuid.png)
        return asset('storage/' . $path);
    }

    public function deleteFiles(string $url): bool
    {
        $path = str_replace(asset('storage/'), '', $url);
        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }
        return false;
    }

    /**
     * Busca as seções por slug da página.
     */
    public function getSectionsByPage(string $slug)
    {
        return SectionsModel::where('page_slug', $slug)
            ->where('is_visible', true)
            ->orderBy('order')
            ->get();
    }

    /**
     * Reordena as seções em uma única transação.
     */
    public function reorderSections(array $sectionsData)
    {
        return DB::transaction(function () use ($sectionsData) {
            foreach ($sectionsData as $data) {
                // Atualiza ordem e conteúdo de uma vez só se o usuário clicou em Salvar
                SectionsModel::where('id', $data['id'])
                    ->update([
                        'order' => $data['order'],
                        'content' => $data['content'] 
                    ]);
            }
            return true;
        });
    }

    /**
     * Atualiza o conteúdo JSON de uma seção específica.
     */
    public function updateSectionContent(int $id, array $content)
    {
        $section = SectionsModel::findOrFail($id);
        return $section->update(['content' => $content]);
    }

    /**
     * Deleta uma seção específica.
     */
    public function deleteSection(int $id) 
    {
        $section = SectionsModel::findOrFail($id);
        return $section->delete();
    }




}