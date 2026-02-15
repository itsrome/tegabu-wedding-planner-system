<?php

namespace App\Http\Controllers;

use App\Models\VendorProfile;
use App\Models\Booking;
use App\Models\Review;
use Illuminate\Http\Request;

class VendorProfileController extends Controller
{
    public function index(Request $request)
    {
        $query = VendorProfile::with(['user', 'reviews']);

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        if ($request->has('min_price')) {
            $query->where('starting_price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('starting_price', '<=', $request->max_price);
        }

        $vendors = $query->orderBy('rating', 'desc')->get();

        return response()->json($vendors);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'category' => 'required|in:venue,catering,photography,videography,florist,music,decoration,makeup,transportation,other',
            'description' => 'required|string',
            'location' => 'required|string',
            'starting_price' => 'required|numeric|min:0',
            'phone' => 'nullable|string',
            'website' => 'nullable|url',
            'services_offered' => 'nullable|array',
        ]);

        $validated['user_id'] = $request->user()->id;

        $profile = VendorProfile::create($validated);

        return response()->json($profile, 201);
    }

    public function show($id)
    {
        $profile = VendorProfile::with(['user', 'reviews.client', 'bookings'])->findOrFail($id);
        return response()->json($profile);
    }

    public function update(Request $request, $id)
    {
        $profile = VendorProfile::findOrFail($id);

        if ($profile->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'business_name' => 'sometimes|string|max:255',
            'category' => 'sometimes|in:venue,catering,photography,videography,florist,music,decoration,makeup,transportation,other',
            'description' => 'sometimes|string',
            'location' => 'sometimes|string',
            'starting_price' => 'sometimes|numeric|min:0',
            'phone' => 'nullable|string',
            'website' => 'nullable|url',
            'services_offered' => 'nullable|array',
        ]);

        $profile->update($validated);

        return response()->json($profile);
    }

    public function myProfile(Request $request)
    {
        $profile = VendorProfile::where('user_id', $request->user()->id)
            ->with(['reviews', 'bookings'])
            ->first();

        return response()->json($profile);
    }

    public function createBooking(Request $request)
    {
        $validated = $request->validate([
            'vendor_profile_id' => 'required|exists:vendor_profiles,id',
            'event_date' => 'required|date|after:today',
            'special_requests' => 'nullable|string',
        ]);

        $validated['client_id'] = $request->user()->id;
        $validated['status'] = 'pending';

        $booking = Booking::create($validated);

        return response()->json($booking->load('vendorProfile'), 201);
    }

    public function getBookings(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'client') {
            $bookings = Booking::where('client_id', $user->id)
                ->with(['vendorProfile.user'])
                ->orderBy('event_date', 'desc')
                ->get();
        } else {
            $profile = VendorProfile::where('user_id', $user->id)->first();
            if (!$profile) {
                return response()->json([]);
            }
            $bookings = Booking::where('vendor_profile_id', $profile->id)
                ->with(['client'])
                ->orderBy('event_date', 'desc')
                ->get();
        }

        return response()->json($bookings);
    }

    public function updateBookingStatus(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        $user = $request->user();

        $profile = VendorProfile::where('user_id', $user->id)->first();
        
        if (!$profile || $booking->vendor_profile_id !== $profile->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
            'quoted_price' => 'nullable|numeric|min:0',
            'vendor_notes' => 'nullable|string',
        ]);

        $booking->update($validated);

        return response()->json($booking);
    }

    public function addReview(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $booking = Booking::findOrFail($validated['booking_id']);

        if ($booking->client_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($booking->status !== 'completed') {
            return response()->json(['error' => 'Can only review completed bookings'], 400);
        }

        $validated['client_id'] = $request->user()->id;
        $validated['vendor_profile_id'] = $booking->vendor_profile_id;

        $review = Review::create($validated);

        // Update vendor rating
        $profile = VendorProfile::find($booking->vendor_profile_id);
        $avgRating = $profile->reviews()->avg('rating');
        $profile->update(['rating' => $avgRating]);

        return response()->json($review->load('client'), 201);
    }
}
