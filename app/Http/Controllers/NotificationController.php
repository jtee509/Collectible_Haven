<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // Method to send notification
    public function sendNotification($userId, $type, $message)
    {
        // Create the notification
        $notification = Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'message' => $message,
            'is_read' => false, // Set the notification as unread initially
        ]);

        return $notification;
    }

    // Method to retrieve notifications for a user
    public function getNotifications($userId)
    {
        // Retrieve all notifications for the user, ordered by creation date
        $notifications = Notification::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }

    // Method to mark a notification as read
    public function markAsRead($notificationId)
    {
        // Find the notification by ID
        $notification = Notification::find($notificationId);

        // Mark it as read
        if ($notification) {
            $notification->is_read = true;
            $notification->save();

            return redirect()->route('dashboard')->with('success', '');
        }

        return redirect()->route('dashboard')->with('success', '');
    }
}
