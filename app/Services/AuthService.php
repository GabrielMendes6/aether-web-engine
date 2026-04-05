<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeNewUser;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Password;


class AuthService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function signUp(Array $data): User {
        $newUser = DB::transaction(function () use ($data) {
            $data['name'] = trim(preg_replace('/[[:cntrl:]]/', '', strip_tags($data['name'])));
            
            // --- NORMALIZAÇÃO DE PLUS ADDRESSING ---
            $email = strtolower(trim($data['email']));
            if (str_contains($email, '+')) {
                // Separa o 'usuario+extra' do '@dominio.com'
                [$local, $domain] = explode('@', $email);
                // Remove tudo do '+' em diante na parte local
                $local = explode('+', $local)[0];
                $email = $local . '@' . $domain;
            }
            $data['email'] = $email;
            // ----------------------------------------

            $data['password'] = Hash::make($data['password']);

            $user = User::create($data);

            return $user;
        });

        try {
            $newUser->sendEmailVerificationNotification();
        } catch (Exception $e) {
            // Registra o erro no log do Laravel (storage/logs/laravel.log)
            Log::error("Falha ao enviar e-mail de verificação para: {$newUser->email}", [
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ]);
        }

        return $newUser;
        
    }

    public function login(array $credentials, string $deviceName): string {
            // Tenta o login. O Auth::attempt já faz o check do Hash internamente.
            if (!Auth::attempt($credentials)) {
                throw ValidationException::withMessages([
                    'email' => ['As credenciais informadas estão incorretas.'],
                ]);
            }

            $user = Auth::user();

            if (!$user->hasVerifiedEmail()) {
                throw ValidationException::withMessages([
                    'email' => ['Seu e-mail ainda não foi verificado. Por favor, verifique sua caixa de entrada.'],
                ]);
            }

            // Criamos o token e retornamos apenas a string (plainTextToken)
            return $user->createToken($deviceName)->plainTextToken;
        }

    public function sendResetLink(string $email): string
    {
        // O Laravel retorna uma string constante indicando sucesso ou falha
        return Password::sendResetLink(['email' => $email]);
    }

    /**
     * Executa a troca da senha no banco de dados
     */
    public function resetPassword(array $data): string
    {
        return Password::reset(
            $data,
            function ($user, $password) {
                $user->forceFill([
                    'password' => \Illuminate\Support\Facades\Hash::make($password)
                ])->setRememberToken(\Illuminate\Support\Str::random(60));

                $user->save();
            }
        );
    }

    // app/Services/AuthService.php

    public function deleteAccount($user): void
    {
        $avatarPath = $user->avatar;

        // 1. Deleta o usuário do banco (isso também invalida os tokens do Sanctum)
        $user->delete();

        // 2. Dispara o Job para limpar os arquivos no Redis
        if ($avatarPath) {
            \App\Jobs\DeleteUserResources::dispatch($avatarPath);
        }
    }
}
