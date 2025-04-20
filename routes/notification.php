<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificationController;

Route::post('/notifications/{notificationId}/mark-as-read', [NotificationController::class, 'markAsRead']);
