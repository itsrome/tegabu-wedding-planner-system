<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    public function index(Request $request)
    {
        $vendors = Vendor::where('user_id', $request->user()->id)->get();
        return response()->json($vendors);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:venue,catering,photography,videography,florist,music,decoration,other',
            'contact_person' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'cost' => 'nullable|numeric|min:0',
            'deposit_paid' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:pending,booked,paid,cancelled',
            'notes' => 'nullable|string',
        ]);

        $validated['user_id'] = $request->user()->id;
        $vendor = Vendor::create($validated);
        return response()->json($vendor, 201);
    }

    public function show(Vendor $vendor)
    {
        return response()->json($vendor);
    }

    public function update(Request $request, Vendor $vendor)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|in:venue,catering,photography,videography,florist,music,decoration,other',
            'contact_person' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'cost' => 'nullable|numeric|min:0',
            'deposit_paid' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:pending,booked,paid,cancelled',
            'notes' => 'nullable|string',
        ]);

        $vendor->update($validated);
        return response()->json($vendor);
    }

    public function destroy(Vendor $vendor)
    {
        $vendor->delete();
        return response()->json(null, 204);
    }
}
