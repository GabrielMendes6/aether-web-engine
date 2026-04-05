<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;

class VerifyEmailQueued extends VerifyEmail implements ShouldQueue
{
    use Queueable;

    /**
     * Criamos um construtor para definir a fila com segurança.
     */
    public function __construct()
    {
        $this->queue = 'emails';
    }
}