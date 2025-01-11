<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Clothe;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Http\Request;

class ClotheController extends Controller
{

    public function index()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['User not authenticated'], 401);
        }

        $clothes = Order::where('user_id', $user->id)->with(['payments' ,'delivery'])->get();

        if ($clothes->isEmpty()) {
            return response()->json([
                'message' => 'Aún no has agregado ropa al carrito '
            ], 404);
        }

        return response()->json([
            'clothes' => $clothes
        ], 200);
    }

    public function getClotheById(string $id)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['User not authenticated'], 401);
        }

        $findClothes = Clothe::where('id', $id)->where('user_id', $user->id)->find($id);

        if (!$findClothes) {
            return response()->json([
                'message' => 'No se ha encontrado ropa '
            ], 404);
        }

        return response()->json($findClothes, 200);
    }

    public function getClothesByCategory(string $name)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['User not authenticated'], 401);
        }

        $category = Category::where('name', $name)->first();

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $findCategoryClothes = Clothe::where('category_id', $category->id)->where('user_id', $user->id)->get();

        if (!$findCategoryClothes) {
            return response()->json(['message' => 'No clothes found for this category'], 404);
        }

        return response()->json($findCategoryClothes, 200);
    }


    public function store(Request $request) // NO SIRVE
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['User not authenticated'], 401);
        }

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string'
        ]);

        $shopClothe = Clothe::create([
            'category_id' => $validated['category_id'],
            'description' => $validated['description'],
            'user_id' => $user->id
        ]);

        return response()->json([
            'message' => 'Ropa agregada al carrito',
            'clothes' => $shopClothe
        ], 201);
    }

    public function addToCart(Request $request) // Pasar a OrderController
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['User not authenticated'], 401);
        }

        $validated = $request->validate([
            'clothes_id' => 'required|exists:clothes,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $order = Order::firstOrCreate(
            ['user_id' => $user->id, 'status' => 'pending']
        );

        $orderItem = OrderItem::where('order_id', $order->id)->where('clothes_id', $validated['clothes_id'])->first();

        if ($orderItem) {
            $orderItem->quantity += $validated['quantity'];
            $orderItem->subtotal = $orderItem->quantity * $orderItem->price_per_unit;
            $orderItem->save();
        } else {
            $clothe = Clothe::findOrFail($validated['clothes_id']);
            $pricePerUnit = $clothe->category->price;

            OrderItem::create([
                'order_id' => $order->id,
                'clothes_id' => $validated['clothes_id'],
                'quantity' => $validated['quantity'],
                'price_per_unit' => $pricePerUnit,
                'subtotal' => $validated['quantity'] * $pricePerUnit,
            ]);
        }

        $order->total_amount = $order->items->sum('subtotal');
        $order->save();

        return response()->json([
            'message' => 'Item added to cart',
            'order' => $order->load('items.clothe'),
        ], 200);
    }

    public function removeFromCartByOrderId(Request $request, $orderId) // Pasar a OrderController
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $validated = $request->validate([
            'clothes_id' => 'required|exists:clothes,id',
        ]);

        $order = Order::where('id', $orderId)
            ->where('user_id', $user->id)
            ->where('status', 'pending') 
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found or cannot be modified'], 404);
        }

        $orderItem = OrderItem::where('order_id', $order->id)
            ->where('clothes_id', $validated['clothes_id'])
            ->first();

        if (!$orderItem) {
            return response()->json(['message' => 'Item not found in this order'], 404);
        }

        $orderItem->delete();

        $order->total_amount = $order->items->sum('subtotal');
        $order->save();

        return response()->json([
            'message' => 'Item removed from cart',
            'order' => $order->load('items.clothe'), 
        ], 200);
    }

    public function createPayment(Request $request, $orderId) // Pasar a PaymentController
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $order = Order::where('id', $orderId)
            ->where('user_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found or already completed'], 404);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:1', // Changed to numeric to handle decimals
            'payment_method' => 'required|string',
        ]);

        // Convert both values to float for comparison
        if (floatval($validated['amount']) != floatval($order->total_amount)) {
            return response()->json(['message' => 'Amount invalid'], 400);
        }

        // Create payment
        $payment = Payment::create([
            'order_id' => $order->id,
            'amount' => $validated['amount'],
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'completed',
        ]);

        // Update order status
        $order->update(['status' => 'processed']); // Changed to 'processed' to match your enum

        $order->delivery->update(['delivery_status' => 'in_transit']);

        return response()->json([
            'message' => 'Payment successful',
            'payment' => $payment,
            'order' => $order,
            'delivery' => $order->delivery
        ], 200);
    }

    public function cancelOrder(Request $request, $orderId)
    {
        $user = auth()->user();

        if(!$user) {
            return response()->json([
                'message' => 'User not authenticated'
            ], 401);
        }

        $order = Order::where('id', $orderId)->where('user_id', $user->id)->where('status', 'pending')->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found or cannot be cancelled'], 404);
        }

        $order->status = 'cancelled';
        $order->save();

        return response()->json([
            'message' => 'Order cancelled',
            'order' => $order
        ], 200);
    }
}
