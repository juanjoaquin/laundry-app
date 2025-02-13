<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Delivery;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getOrderHistory(Request $request)
    {
        $user = auth()->user();

        $query = Order::with(['items.clothe', 'delivery']);

        if ($user->role === 'user') {
            $query->where('user_id', $user->id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $orders = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'message' => 'Filtered order history retrieved successfully',
            'orders' => $orders,
        ], 200);
    }

    public function updateOrderStatus(Request $request, string $id)
    {
        $this->authorize('isAdmin');

        $request->validate([
            'status' => 'required|in:pending,processed,delivered'
        ]);

        $order = Order::find($id);

        if(!$order) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }

        $order->status = $request->status;
        $order->save();

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order
        ], 200);
    }

    public function updatePriceClothe(Request $request, string $id)
    {
        $this->authorize('isAdmin');

        $request->validate([
            'price' => 'required|integer'
        ]);

        $CategoryPrice = Category::find($id);

        if(!$CategoryPrice) {
            return response()->json([
                'message' => 'Category not found'
            ], 404);
        }

        $CategoryPrice->price = $request->price;
        $CategoryPrice->save();

        return response()->json([
            'message' => 'Price updated successfully',
            'category' => $CategoryPrice
        ], 200);
    }

    public function destroyCategory(string $id)
    {
        $category = Category::find($id);

        if(!$category) {
            return response()->json([
                'message' => 'Category not found'
            ], 404);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted succesfully'
        ], 200);
    }


    public function updateDeliveryStatus(Request $request, string $id)
    {
        $this->authorize('isAdmin');

        $request->validate([
            'delivery_status' => 'required|in:pending,in_transit,delivered'
        ]);

        $delivery = Delivery::find($id);

        if(!$delivery) {
            return response()->json([
                'message' => 'Delivery not found'
            ], 404);
        }

        $delivery->delivery_status = $request->delivery_status;
        $delivery->save();

        return response()->json([
            'message' => 'Delivery status updated successfully',
            'delivery' => $delivery
        ], 200);
    }
    
    public function getOrder(string $id)
    {
        $order = Order::with(['items', 'delivery'])->find($id);

        if(!$order) {
            return response()->json([
                'message' => 'Cannot find Order'
            ], 404);
        }

        return response()->json($order, 200);
    }

    public function getAllUsers()
    {
        $users = User::all();
        
        if($users->isEmpty()) {
            return response()->json([
                'message' => 'Users not found'
            ], 404);
        }

        return response()->json([
            'users' => $users
        ], 200);
    }

   
    public function getOrdersPending()
    {
        $this->authorize('isAdmin'); 

        $ordersPending = Order::where('status', 'pending')->orderBy('created_at', 'desc')->get();

        if($ordersPending->isEmpty()) {
            return response()->json([
                'message' => 'No hay ordenes pendientes'
            ], 404);
        }

        return response()->json([
            'message' => 'Ordenes pendientes disponibles:',
            'orders' => $ordersPending
        ], 200);
    }


    public function deleteUser(string $id)
    {
        $findUser = User::find($id);
    
        if (!$findUser) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
    
        $findUser->orders()->delete(); 
    
        $findUser->delete();
    
        return response()->json([
            'message' => 'User has been deleted successfully'
        ], 200);
    }
    

    public function showUser(string $id)
    {
        $user = User::with('orders')->find($id);

        if(!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
        return response()->json($user, 200);
    }


}
