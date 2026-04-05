<?php

namespace App\Listeners;

use App\Mail\WelcomeNewUser;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Mail;

class SendWelcomeEmail
{
    public function handle(Verified $event): void
    {
        // O $event->user contém o objeto do usuário que acabou de verificar
        Mail::to($event->user->email)->send(new WelcomeNewUser($event->user));
    }
}