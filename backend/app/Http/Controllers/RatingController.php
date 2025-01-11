<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Rating;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    public function createRating(Request $request, $orderId) 
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $order = Order::where('id', $orderId)->where('user_id', $user->id)->where('status', 'delivered')->first();
    
        if(!$order) {
            return response()->json(['message' => 'Order not found or not delivered'], 404);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        $rating = Rating::create([
            'order_id' => $order->id,
            'user_id' => $user->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null
        ]);

        return response()->json([
            'message' => 'Rating successfully created',
            'rating' => $rating,
        ], 201);
    }
}
