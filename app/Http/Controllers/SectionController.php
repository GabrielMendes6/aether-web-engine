<?php 

namespace App\Http\Controllers;

use App\Services\SectionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SectionController extends Controller
{
    protected $sectionService;

    public function __construct(SectionService $sectionService)
    {
        $this->sectionService = $sectionService;
    }

    public function store(Request $request): JsonResponse {
        $request->validate([
            'page_slug' => ['required', 'string'],
            'component' => ['required', 'string'],
            'content' => ['required', 'array']
        ]);

        $section = $this->sectionService->createSection($request->all());

        return response()->json([
            'message' => 'Seção "' .$section->component . '" criadacom sucesso!',
            'section' => $section
        ], 201);
    }

    public function uploadFiles(Request $request) {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,gif,mp4,mov,avi|max:51200', // Aumentei para 50MB
        ]);

        try {
            $url = $this->sectionService->uploadFiles($request->file('file'));

            return response()->json([
                'success' => true,
                'url' => $url,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao processar upload: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteFiles(Request $request) {
        $request->validate([
            'url' => 'required|string'
        ]);

        $this->sectionService->deleteFiles($request);

        return response()->json([
            'success' => true,
            'message' => 'Arquivo apagado com sucesso'
        ]);
    }

    public function getByPage(string $slug): JsonResponse
    {
        $sections = $this->sectionService->getSectionsByPage($slug);
        return response()->json($sections);
    }

    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'sections' => 'required|array',
            'sections.*.id' => 'required|exists:site_sections,id',
            'sections.*.order' => 'required|integer',
        ]);

        $this->sectionService->reorderSections($request->sections);

        return response()->json(['message' => 'Ordem atualizada com sucesso pelo Jarvis Service.']);
    }

    public function updateContent(Request $request): JsonResponse
    {
        $request->validate([
            'id' => 'required|exists:site_sections,id',
            'content' => 'required|array'
        ]);

        if (!auth()->user() || !user()->is_admin) {
            return response()-json([
                'error' => 'não autorizado'
            ], 403);
        }

        $this->sectionService->updateSectionContent($request->id, $request->content);

        return response()->json(['message' => 'Conteúdo da seção atualizado!']);
    }

    public function destroy(int $id): JsonResponse {
        $this->sectionService->deleteSection($id);

        return response()->json([
            'message' => 'Seção removida com sucesso.'
        ]);
    }
}