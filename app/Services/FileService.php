<?php

namespace App\Services;

use App\Jobs\ProcessUserAvatar;
use App\Models\User;
use Illuminate\Http\UploadedFile;

class FileService
{
    public function updateAvatar(User $user, UploadedFile $file): void
    {
        // Salva o original numa pasta temporária rápido
        $tempPath = $file->store('temp', 'public');

        // Dispara o Job para o Redis processar depois
        ProcessUserAvatar::dispatch($user, $tempPath)->onQueue('default');
    }
}