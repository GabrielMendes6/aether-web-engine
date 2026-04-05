<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|max:10240', // até 10MB
        ]);

        $this->fileService->updateAvatar(auth()->user(), $request->file('avatar'));

        return response()->json([
            'message' => 'Upload concluído! Sua foto está sendo processada e aparecerá em instantes.'
        ]);
    }
}
