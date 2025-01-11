<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{

    public function index()
    {
        $categories = Category::all();

        if($categories->isEmpty()) {
            return response()->json([
                'message' => 'Categories not found'
            ], 404);
        }

        return response()->json($categories, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|integer',
            'image' => 'required|string|min:1|max:255'
        ]);

        $category = Category::create([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'image' => $validated['image']
        ]);

        return response()->json($category, 201);
    }
}
