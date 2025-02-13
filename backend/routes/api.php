<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ClotheController;
use App\Http\Controllers\DeliveryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\RopaController;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });


// Auth route
Route::group(['middleware' => 'api','prefix' => 'auth'], function ($router) {

    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);
});

//Route auth para users
Route::group(['middleware' => 'api'], function () {
    
    Route::get('clothes/delivery', [ClotheController::class, 'index']); // Traer Orden de Ropa por User
    Route::get('clothes', [ClotheController::class, 'getCartClothes']); // Traer Orden con Delivery, e items por ID
    Route::get('clothes/categories', [CategoryController::class, 'index']);
    // Route::post('clothes', [ClotheController::class, 'store']); // NO SIRVE
    Route::get('clothes/{id}', [ClotheController::class, 'getClotheById']); // Traer ropa por ID
    Route::get('clothes/category/{name}', [ClotheController::class, 'getClothesByCategory']); // Traer ropa por Categoria

    Route::post('cart', [ClotheController::class, 'addToCart']); // Agregar Ropa al Carrito del User. 1 -> paso
    Route::post('orders/{orderId}/pay', [ClotheController::class, 'createPayment']); // Pagar la ropa del Carrito. 3 -> paso

    Route::post('orders/{orderId}/delivery', [DeliveryController::class, 'createDelivery']); // Agregar delivery al pedido. 2 -> paso

    Route::post('orders/{orderId}/rating', [RatingController::class, 'createRating']); // Agregar Rating a una orden con status "delivered". 4 -> paso

    Route::delete('cart/{orderItemId}', [ClotheController::class, 'removeFromCartByOrderId']); //Remover Elemento del Carrito

    Route::get('historial', [OrderController::class, 'getOrderHistory']); //Traerse el historial
    Route::post('orders/{orderId}/cancel', [ClotheController::class, 'cancelOrder']); // Cancelar orden en "pending"

    Route::delete('cart/clear', [ClotheController::class, 'clearCart']);

  


});

Route::group(['middleware' => ['auth', 'admin']], function () {
    Route::get('admin/orders', [AdminController::class, 'getOrderHistory']); //Obtener todas ordenes de los users
    Route::get('admin/orders/{id}', [AdminController::class, 'getOrder']);
    Route::put('admin/orders/{id}/status', [AdminController::class, 'updateOrderStatus']); // Actualizar order status
    Route::put('admin/deliveries/{id}/status', [AdminController::class, 'updateDeliveryStatus']); // Actualizar delivery status
    Route::get('admin/orders-pending', [AdminController::class, 'getOrdersPending']); // Todas las ordenes Pending
    Route::delete('admin/delete-user/{id}', [AdminController::class, 'deleteUser']); // Deletear usuarios
    Route::get('admin/users/{id}', [AdminController::class, 'showUser']); // Mostrar user por ID
    Route::get('admin/users', [AdminController::class, 'getAllUsers']); // Traer all users
    Route::post('admin/categories/create-category', [CategoryController::class, 'store']);

    Route::put('admin/clothes/update-price/{id}', [AdminController::class, 'updatePriceClothe']); // Updatear el precio de la Categoria/ropa
    Route::delete('admin/clothes/delete-category/{id}', [AdminController::class, 'destroyCategory']);

    
    Route::put('clothes/categories/{id}', [ClotheController::class, 'updateImage']); //Update image
});

