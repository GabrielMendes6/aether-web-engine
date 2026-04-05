<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class ProcessUserAvatar implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        protected User $user,
        protected string $tempPath
    ) {}

    public function handle(): void
    {
        // 1. Lê a imagem original da pasta temporária
        $img = Image::read(Storage::disk('public')->path($this->tempPath));

        // 2. Redimensiona de forma eficiente (400x400)
        $img->cover(400, 400);

        // 3. Define o caminho final
        $finalPath = 'avatars/user_' . $this->user->id . '.webp';

        // 4. Salva a imagem processada (usando formato WebP para maior economia)
        Storage::disk('public')->put($finalPath, (string) $img->toWebp(80));

        // 5. Atualiza o usuário e deleta a temporária
        $oldAvatar = $this->user->avatar;
        $this->user->update(['avatar' => $finalPath]);
        
        Storage::disk('public')->delete($this->tempPath);
        if ($oldAvatar && $oldAvatar !== $finalPath) {
            Storage::disk('public')->delete($oldAvatar);
        }
    }
}