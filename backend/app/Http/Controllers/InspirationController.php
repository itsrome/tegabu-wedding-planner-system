<?php

namespace App\Http\Controllers;

use App\Models\InspirationImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InspirationController extends Controller
{
    public function index(Request $request)
    {
        $images = InspirationImage::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($images);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $path = $request->file('image')->store('inspiration', 'public');

        $image = InspirationImage::create([
            'user_id' => $request->user()->id,
            'image_path' => $path,
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return response()->json($image, 201);
    }

    public function destroy(Request $request, $id)
    {
        $image = InspirationImage::where('user_id', $request->user()->id)
            ->findOrFail($id);

        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return response()->json(['message' => 'Image deleted']);
    }
}
