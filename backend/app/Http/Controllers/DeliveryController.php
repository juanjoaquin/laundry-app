<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use App\Models\Order;
use Illuminate\Http\Request;

class DeliveryController extends Controller
{
    public function createDelivery(Request $request, $orderId)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $order = Order::where('id', $orderId)->where('user_id', $user->id)->where('status', 'pending')->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found or already completed'], 404);
        }

        $validated = $request->validate([
            'address' => 'required|string|min:1',
            'on_sucursal' => 'nullable|string'
        ]);

        $delivery = Delivery::create([
            'order_id' => $order->id,
            'address' => $validated['address'],
            'on_sucursal' => $validated['on_sucursal'] ?? null,
            'delivery_status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Delivery details successfully created',
            'delivery' => $delivery,
        ], 201);
    }
}
