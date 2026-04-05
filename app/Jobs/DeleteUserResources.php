<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class DeleteUserResources implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(protected string $avatarPath) {}

    public function handle(): void
    {
        if ($this->avatarPath) {
            Storage::disk('public')->delete($this->avatarPath);
        }
        
        // Aqui você poderia apagar outras coisas, como documentos ou fotos de galeria
    }
}