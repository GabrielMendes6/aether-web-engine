<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SectionController; 
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryProductController;

/*
|--------------------------------------------------------------------------
| Rotas Públicas (Acesso livre)
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return view('welcome');
});

// Autenticação e Recuperação
Route::post('/auth/register', [AuthController::class, 'signUp'])->middleware('throttle:5,1');
Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Carregamento de seções dinâmicas (Público para os visitantes verem o site)
Route::get('/sections/{slug}', [SectionController::class, 'getByPage']);

/*
|--------------------------------------------------------------------------
| Rotas Protegidas (Apenas Logados)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    
    // Dados do usuário logado
    Route::get('/auth/me', function (Request $request) {
        return $request->user();
    });

    // Perfil e Avatar
    Route::delete('/user/profile', [AuthController::class, 'destroy']);
    Route::post('/user/avatar', [UserController::class, 'updateAvatar']);

    /*
    |--------------------------------------------------------------------------
    | Rotas de Administração (Apenas Admin)
    |--------------------------------------------------------------------------
    */
    Route::middleware('admin')->group(function () {
        // Gerenciamento Universal de Seções (CRUD dinâmico)
        Route::prefix('sections')->group(function () {
            Route::post('/add', [SectionController::class, 'store']); // Criar (+)
            Route::post('/reorder', [SectionController::class, 'reorder']); // Reordenar (Setas)
            Route::post('/update-content', [SectionController::class, 'updateContent']); // Editar (onBlur)
            Route::delete('/{id}', [SectionController::class, 'destroy']); // Deletar (Lixeira)
            Route::post('/uploadFiles', [SectionController::class, 'uploadFiles']); // Salva imagem/video das Sections
            Route::delete('/deleteFiles', [SectionController::class, 'deleteFiles']); // Deleta Foto/video das Sections

            
        });

        /*
        |--------------------------------------------------------------------------
        | Rotas de Produtos
        |--------------------------------------------------------------------------
        */
        Route::post('/product/add', [ProductController::class, 'store']);
        Route::post('/categories/add', [CategoryProductController::class, 'store']);
    });
});

/*
|--------------------------------------------------------------------------
| Rotas de Produtos
|--------------------------------------------------------------------------
*/

Route::get('/product/{slug}', [ProductController::class, 'getProduct']);
Route::get('/products', [ProductController::class, 'allProduct']);
Route::get('/products/mode', [ProductController::class, 'index']);
Route::get('/categories', [CategoryProductController::class, 'index']);