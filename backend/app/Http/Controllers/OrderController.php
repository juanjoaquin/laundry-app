<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use App\Notifications\OrderStatusChanged;
use Illuminate\Support\Facades\Auth;


class OrderController extends Controller
{
    public function getOrderHistory(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $query = Order::with(['items.clothe', 'delivery',])->where('user_id', $user->id);

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $orders = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'message' => 'Filtered order history retrieved successfully',
            'orders' => $orders,
        ], 200);
    }

}
