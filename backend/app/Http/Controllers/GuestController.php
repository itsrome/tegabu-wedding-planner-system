<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    public function index(Request $request)
    {
        $guests = Guest::where('user_id', $request->user()->id)->get();
        return response()->json($guests);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'side' => 'required|in:bride,groom,both',
            'rsvp_status' => 'nullable|in:pending,confirmed,declined',
            'plus_ones' => 'nullable|integer|min:0',
            'dietary_restrictions' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $validated['user_id'] = $request->user()->id;
        $guest = Guest::create($validated);
        return response()->json($guest, 201);
    }

    public function show(Guest $guest)
    {
        return response()->json($guest);
    }

    public function update(Request $request, Guest $guest)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'side' => 'sometimes|in:bride,groom,both',
            'rsvp_status' => 'nullable|in:pending,confirmed,declined',
            'plus_ones' => 'nullable|integer|min:0',
            'dietary_restrictions' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $guest->update($validated);
        return response()->json($guest);
    }

    public function destroy(Guest $guest)
    {
        $guest->delete();
        return response()->json(null, 204);
    }
}
