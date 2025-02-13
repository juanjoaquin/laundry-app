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

    public function getCartClothes()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['User not authenticated'], 401);
        }

        $clothes = Order::where('user_id', $user->id)->with('items.clothe')->get();

        if ($clothes->isEmpty()) {
            return response()->json([
                'message' => 'Aún no has agregado ropa al carrito '
            ], 404);
        }

        return response()->json([
            'clothes' => $clothes
        ], 200);
    }

    public function index() // Es el mismo que getCartClothes()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['User not authenticated'], 401);
        }

        $clothes = Order::where('user_id', $user->id)->with(['payments', 'delivery', 'items.clothe'])->get();

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


    public function updateImage(Request $request, string $id)
    {
        $validate = $request->validate([
            'image' => 'required|string|max:255'
        ]);

        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Cannot find Category'
            ], 404);
        }

        $category->image = $validate['image'];
        $category->save();

        return response()->json([
            'message' => 'Category image updated successfully',
            'category' => $category
        ], 200);
    }


    public function addToCart(Request $request) // Pasar a Order Controller
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id', 
            'quantity' => 'required|integer|min:1',
        ]);

        
        $category = Category::findOrFail($validated['category_id']);

        
        $clothe = Clothe::firstOrCreate([
            'category_id' => $validated['category_id'],
            'user_id' => $user->id,
        ]);

        
        $order = Order::firstOrCreate(
            ['user_id' => $user->id, 'status' => 'pending']
        );

        
        $orderItem = OrderItem::where('order_id', $order->id)
            ->where('clothes_id', $clothe->id) 
            ->first();

        if ($orderItem) {
            $orderItem->quantity += $validated['quantity'];
            $orderItem->subtotal = $orderItem->quantity * $category->price;
            $orderItem->save();
        } else {
            
            OrderItem::create([
                'order_id' => $order->id,
                'clothes_id' => $clothe->id, 
                'quantity' => $validated['quantity'],
                'price_per_unit' => $category->price,
                'subtotal' => $validated['quantity'] * $category->price,
            ]);
        }

        
        $order->total_amount = $order->items->sum('subtotal');
        $order->save();

        
        return response()->json([
            'message' => 'Item added to cart',
            'order' => $order->load('items.clothe.category'), 
        ], 200);
    }




    public function removeFromCartByOrderId($orderItemId)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $orderItem = OrderItem::find($orderItemId);

        if (!$orderItem) {
            return response()->json(['message' => 'Item not found in cart'], 404);
        }

        
        $order = $orderItem->order;

        $orderItem->delete();

        $order->total_amount = $order->items->sum('subtotal');
        $order->save();

        return response()->json([
            'message' => 'Item removed from cart',
            'removed_item' => $orderItem,  
            'order' => $order->load('items.clothe'), 
        ], 200);
    }


    public function createPayment(Request $request, $orderId) 
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
            'amount' => 'required|integer|min:1', 
            'number_card' => 'required|string|min:1', 
            'code_security' => 'required|string|min:1', 
            'name_card' => 'required|string|min:1', 
            'payment_method' => 'required|string',
        ]);

        if (floatval($validated['amount']) != floatval($order->total_amount)) {
            return response()->json(['message' => 'Amount invalid'], 400);
        }

        $payment = Payment::create([
            'order_id' => $order->id,
            'amount' => $validated['amount'],
            'number_card' => $validated['number_card'],
            'name_card' => $validated['name_card'],
            'code_security' => $validated['code_security'],
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'completed',
        ]);

        $order->update(['status' => 'processed']); 

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

        if (!$user) {
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


    public function clearCart(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        
        $order = Order::where('user_id', $user->id)->where('status', 'pending')->first();

        if ($order) {
            
            $order->items()->delete();
            $order->update(['total_amount' => 0]);
        }

        return response()->json(['message' => 'Carrito limpiado con éxito']);
    }
}
