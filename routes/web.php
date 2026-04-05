<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controller\AuthController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\SectionsController;

Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
    ->name('verification.verify');

Route::get('/home/sections', [SectionsController::class, 'getByPage']);
