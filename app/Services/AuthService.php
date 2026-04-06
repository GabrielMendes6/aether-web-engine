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
            Log::error("Falha ao enviar e-mail de verificação para: {$newUser->email}", [
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ]);
        }

        return $newUser;
        
    }

    public function login(array $credentials, string $deviceName): string {
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

            return $user->createToken($deviceName)->plainTextToken;
        }

    public function sendResetLink(string $email): string
    {
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

    public function deleteAccount($user): void
    {
        $avatarPath = $user->avatar;
        $user->delete();

        if ($avatarPath) {
            \App\Jobs\DeleteUserResources::dispatch($avatarPath);
        }
    }
}
