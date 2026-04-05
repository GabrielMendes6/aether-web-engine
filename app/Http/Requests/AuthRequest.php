<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class AuthRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required', 
                'string', 
                'min:3', 
                'max:255',
                'regex:/^[a-zA-ZÀ-ÿ\s]+$/', // Bloqueia símbolos e números no nome
            ],
            'email' => [
                'required',
                'string',
                'email:rfc,dns', // Valida se o formato é real e se o domínio existe
                'max:255',
                'unique:users,email',
                // Prevenção contra e-mails temporários (Exemplo manual)
                function ($attribute, $value, $fail) {
                    $blockedDomains = ['mailinator.com', '10minutemail.com', 'tempmail.com'];
                    $domain = substr(strrchr($value, "@"), 1);
                    if (in_array($domain, $blockedDomains)) {
                        $fail('Por favor, utilize um e-mail permanente.');
                    }
                },
            ],
            'tel' => [
                'nullable',
                'string',
                'min:10',
                'max:15',
            ],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->letters()     // Pelo menos uma letra
                    ->mixedCase()   // Maiúsculas e minúsculas
                    ->numbers()     // Pelo menos um número
                    ->symbols()     // Pelo menos um caractere especial
                    ->uncompromised(), // REGRA DE ELITE: Bloqueia senhas que já vazaram na web
            ],
            // O nosso Honeypot invisível que já configuramos
            'website_link' => ['present', 'max:0'], 
        ];
    }

    /**
     * Customizando as mensagens para o cliente brasileiro.
     */
    public function messages(): array
    {
        return [
            'name.regex' => 'O nome deve conter apenas letras.',
            'email.unique' => 'Este e-mail já está cadastrado em nossa base.',
            'email.email' => 'Informe um endereço de e-mail válido.',
            'password.min' => 'A senha deve ter no mínimo 8 caracteres.',
            'password.letters' => 'A senha deve conter ao menos uma letra.',
            'password.symbols' => 'A senha deve conter ao menos um símbolo (@, !, #, etc).',
            'password.uncompromised' => 'Esta senha é muito comum e foi encontrada em vazamentos de dados. Por segurança, escolha outra.',
            'website_link.max' => 'Tentativa de spam detectada.',
        ];
    }
}

