<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
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
}
