<?php

use App\Http\Controllers\ExportProjectToFTPController;
use App\Http\Controllers\ProjectDownloadController;
use App\Http\Controllers\ProjectsController;
use App\Http\Controllers\ProjectThumbnailController;
use Common\Auth\Controllers\GetAccessTokenController;
use Common\Auth\Controllers\RegisterController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['prefix' => 'v1'], function() {
    Route::group(['middleware' => 'auth:sanctum'], function () {
        // projects
        Route::get('projects', [ProjectsController::class, 'index']);
        Route::post('projects/{project}/export/ftp', [ExportProjectToFTPController::class, 'export']);
        Route::post('projects', [ProjectsController::class, 'store']);
        Route::get('projects/{id}', [ProjectsController::class, 'show']);
        Route::put('projects/{id}', [ProjectsController::class, 'update']);
        Route::put('projects/{project}/toggle-state', [ProjectsController::class, 'toggleState']);
        Route::delete('projects', [ProjectsController::class, 'destroy']);
        Route::post('projects/{id}/generate-thumbnail', [ProjectThumbnailController::class, 'store']);
        Route::get('projects/{project}/download', [ProjectDownloadController::class, 'download']);
    });

    // AUTH
    Route::post('auth/register', [RegisterController::class, 'register']);
    Route::post('auth/login', [GetAccessTokenController::class, 'login']);
    Route::get('auth/social/{provider}/callback', '\Common\Auth\Controllers\SocialAuthController@loginCallback');
    Route::post('auth/password/email', '\Common\Auth\Controllers\SendPasswordResetEmailController@sendResetLinkEmail');
});
