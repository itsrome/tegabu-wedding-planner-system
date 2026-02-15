<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function getConversations(Request $request)
    {
        $userId = $request->user()->id;
        
        $conversations = Conversation::where('user1_id', $userId)
            ->orWhere('user2_id', $userId)
            ->with(['user1', 'user2', 'latestMessage'])
            ->orderBy('last_message_at', 'desc')
            ->get()
            ->map(function ($conversation) use ($userId) {
                $otherUser = $conversation->user1_id === $userId 
                    ? $conversation->user2 
                    : $conversation->user1;
                
                return [
                    'id' => $conversation->id,
                    'other_user' => [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                        'role' => $otherUser->role,
                    ],
                    'last_message' => $conversation->latestMessage,
                    'last_message_at' => $conversation->last_message_at,
                ];
            });

        return response()->json($conversations);
    }

    public function getMessages(Request $request, $conversationId)
    {
        $conversation = Conversation::findOrFail($conversationId);
        
        // Verify user is part of conversation
        if ($conversation->user1_id !== $request->user()->id && 
            $conversation->user2_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $messages = Message::where('conversation_id', $conversationId)
            ->with('sender')
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark messages as read
        Message::where('conversation_id', $conversationId)
            ->where('sender_id', '!=', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json($messages);
    }

    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'recipient_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        $senderId = $request->user()->id;
        $recipientId = $validated['recipient_id'];

        // Find or create conversation
        $conversation = Conversation::where(function ($query) use ($senderId, $recipientId) {
            $query->where('user1_id', $senderId)->where('user2_id', $recipientId);
        })->orWhere(function ($query) use ($senderId, $recipientId) {
            $query->where('user1_id', $recipientId)->where('user2_id', $senderId);
        })->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'user1_id' => $senderId,
                'user2_id' => $recipientId,
                'last_message_at' => now(),
            ]);
        } else {
            $conversation->update(['last_message_at' => now()]);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $senderId,
            'message' => $validated['message'],
        ]);

        return response()->json($message->load('sender'), 201);
    }

    public function getUsers(Request $request)
    {
        $users = User::where('id', '!=', $request->user()->id)
            ->select('id', 'name', 'email', 'role')
            ->get();

        return response()->json($users);
    }
}
