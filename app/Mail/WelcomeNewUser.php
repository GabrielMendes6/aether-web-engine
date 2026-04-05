<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class WelcomeNewUser extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Ao declarar como 'public', o Laravel torna a variável 
     * disponível na View sem precisar passar um array manual.
     */
    public function __construct(public $newUser) 
    {
        //
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.welcome',
        );
    }
}