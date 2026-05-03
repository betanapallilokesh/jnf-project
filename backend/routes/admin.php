<?php

use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminRecruiterController;
use App\Http\Controllers\Api\Admin\AdminReviewController;
use App\Http\Controllers\Api\Admin\AdminGeneralController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->group(function () {

    // 🔓 Public admin auth
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AdminAuthController::class, 'login']);
    });

    // 🔐 Protected admin routes
    Route::middleware(['auth:sanctum', 'admin.auth'])->group(function () {

        // Auth
        Route::prefix('auth')->group(function () {
            Route::get('/me', [AdminAuthController::class, 'me']);
            Route::post('/logout', [AdminAuthController::class, 'logout']);
        });

        // Dashboard
        Route::get('/dashboard', AdminDashboardController::class);

        // JNF Review
        Route::prefix('jnfs')->group(function () {
            Route::get('/', [AdminReviewController::class, 'index']);
            Route::get('/{jnf}', [AdminReviewController::class, 'show']);
            Route::post('/{jnf}/start-review', [AdminReviewController::class, 'startReview']);
            Route::post('/{jnf}/request-changes', [AdminReviewController::class, 'requestChanges']);
            Route::post('/{jnf}/approve', [AdminReviewController::class, 'approve']);
            Route::post('/{jnf}/close', [AdminReviewController::class, 'close']);
        });

        // Recruiter management
        Route::get('/recruiters', [AdminRecruiterController::class, 'index']);
        Route::patch('/recruiters/{recruiter}/status', [AdminRecruiterController::class, 'updateStatus']);
        Route::delete('/recruiters/{recruiter}', [AdminRecruiterController::class, 'destroy']);

        // General admin data
        Route::get('/companies', [AdminGeneralController::class, 'companies']);
        Route::delete('/companies/{company}', [AdminGeneralController::class, 'destroyCompany']);
        Route::get('/activities', [AdminGeneralController::class, 'activities']);
        Route::get('/notifications', [AdminGeneralController::class, 'notifications']);
    });
});