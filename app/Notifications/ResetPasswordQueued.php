<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;

class ResetPasswordQueued extends ResetPassword implements ShouldQueue
{
    use Queueable;

    // Definimos a mesma fila que os outros e-mails para manter a ordem
    public function __construct($token)
    {
        parent::__construct($token);
        $this->queue = 'emails';
    }
}