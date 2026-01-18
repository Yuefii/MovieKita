<?php

use App\Http\Controllers\AdminStatsController;
use App\Http\Controllers\MomentController;
use App\Http\Controllers\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/moments', [MomentController::class, 'store']);
    
    Route::middleware(['admin'])->group(function () {
        Route::get('/admin/stats', [AdminStatsController::class, 'index']);
    });
});

Route::get('/moments', [MomentController::class, 'index']);