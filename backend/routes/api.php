<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\BudgetItemController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\VendorProfileController;
use App\Http\Controllers\InspirationController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('vendor-profiles', [VendorProfileController::class, 'index']);
Route::get('vendor-profiles/{id}', [VendorProfileController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('user', [AuthController::class, 'user']);
    Route::put('user/update', [AuthController::class, 'updateProfile']);
    
    Route::apiResource('guests', GuestController::class);
    Route::apiResource('vendors', VendorController::class);
    Route::apiResource('tasks', TaskController::class);
    Route::apiResource('budget-items', BudgetItemController::class);
    Route::get('budget/summary', [BudgetItemController::class, 'summary']);
    
    // Messages
    Route::get('conversations', [MessageController::class, 'getConversations']);
    Route::get('conversations/{id}/messages', [MessageController::class, 'getMessages']);
    Route::post('messages', [MessageController::class, 'sendMessage']);
    Route::get('users', [MessageController::class, 'getUsers']);
    
    // Vendor Marketplace
    Route::post('vendor-profiles', [VendorProfileController::class, 'store']);
    Route::put('vendor-profiles/{id}', [VendorProfileController::class, 'update']);
    Route::get('my-vendor-profile', [VendorProfileController::class, 'myProfile']);
    Route::post('bookings', [VendorProfileController::class, 'createBooking']);
    Route::get('bookings', [VendorProfileController::class, 'getBookings']);
    Route::put('bookings/{id}/status', [VendorProfileController::class, 'updateBookingStatus']);
    Route::post('reviews', [VendorProfileController::class, 'addReview']);
    
    // Inspiration Board
    Route::get('inspiration', [InspirationController::class, 'index']);
    Route::post('inspiration', [InspirationController::class, 'store']);
    Route::delete('inspiration/{id}', [InspirationController::class, 'destroy']);
    
    // Admin Routes
    Route::get('admin/stats', [AdminController::class, 'getStats']);
    Route::get('admin/bookings', [AdminController::class, 'getAllBookings']);
    Route::delete('admin/users/{id}', [AdminController::class, 'deleteUser']);
    Route::delete('admin/bookings/{id}', [AdminController::class, 'deleteBooking']);
    Route::delete('admin/reviews/{id}', [AdminController::class, 'deleteReview']);
});
