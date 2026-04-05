<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AuthService;
use App\Http\Requests\AuthRequest;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;


class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    public function signUp(AuthRequest $request) {
        $data = $request->validated();

        $newUser = $this->authService->signUp($data);

        if (!$newUser) {
            Log::warning("Tentativa de cadastro suspeita bloqueada", ['ip' => $request->ip()]);
        }

        return response()->json([
            "success" => true,
            "User" => $newUser,
        ], 200);
    }
    
    public function login(LoginRequest $request) {
        // 1. Verifica se já excedeu o limite de tentativas (Rate Limit)
        $request->authenticate();

        try {
            $token = $this->authService->login(
                $request->validated(), 
                $request->userAgent() ?? 'Unknown Device'
            );

            // 2. Se chegou aqui, o login deu certo. Limpamos o contador de tentativas.
            RateLimiter::clear($request->throttleKey());

            $user = Auth::user();

            return response()->json([
                'success' => true,
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_admin' => (bool) $user->is_admin
                ],
            ], 200);

        } catch (\Throwable $e) { // Captura qualquer erro (DB, código, etc)
            RateLimiter::hit($request->throttleKey());

            if ($e instanceof \Illuminate\Validation\ValidationException) {
                throw $e;
            }

            // Correção: era Facades (com 's') e Log::critical
            \Illuminate\Support\Facades\Log::critical('Falha Critica no Login', [
                'error' => $e->getMessage(),
                'user' => $request->email
            ]);

            return response()->json([
                'message' => 'O serviço de autenticação está instável. Tente novamente mais tarde!'
            ], 500); // Adicione o status 500 aqui
        }
    }

    public function forgotPassword(Request $request) 
    {
        $request->validate(['email' => 'required|email']);

        // Chamamos o Service
        $status = $this->authService->sendResetLink($request->email);

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Link de recuperação enviado com sucesso.'], 200)
            : response()->json(['email' => __($status)], 400);
    }

    public function resetPassword(Request $request) 
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        // Chamamos o Service passando apenas os dados validados
        $status = $this->authService->resetPassword($request->all());

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Senha redefinida com sucesso.'], 200)
            : response()->json(['message' => __($status)], 400);
    }

    public function destroy(Request $request)
    {
        // Opcional: Validar a senha antes de deletar para segurança extra
        
        $this->authService->deleteAccount(auth()->user());

        return response()->json([
            'message' => 'Sua conta e todos os seus dados foram removidos com sucesso.'
        ], 200);
    }
}