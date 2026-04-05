<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;

class VerificationController extends Controller
{
    public function verify(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);

        // 1. Valida a assinatura digital (Segurança contra falsificação)
        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Link de verificação inválido.'], 403);
        }

        if (! $request->hasValidSignature()) {
            return response()->json(['message' => 'O link expirou ou é inválido.'], 403);
        }

        // 2. Verifica se já foi verificado para evitar reprocessamento
        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'E-mail já verificado anteriormente.']);
        }

        // 3. Marca como verificado e dispara o evento 'Verified'
        if ($user->markEmailAsVerified()) {
            event(new Verified($user)); // Isso aciona o seu Listener para enviar o Welcome Email
        }

        return response()->json([
            'success' => true,
            'message' => 'E-mail validado com sucesso! Bem-vindo à Box Presentes.'
        ], 200);
    }
}