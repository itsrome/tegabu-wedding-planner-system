<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorProfile extends Model
{
    protected $fillable = [
        'user_id',
        'business_name',
        'category',
        'description',
        'location',
        'starting_price',
        'phone',
        'website',
        'portfolio_images',
        'services_offered',
        'is_verified',
        'rating',
        'total_bookings',
    ];

    protected $casts = [
        'starting_price' => 'decimal:2',
        'rating' => 'decimal:2',
        'portfolio_images' => 'array',
        'services_offered' => 'array',
        'is_verified' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function packages()
    {
        return $this->hasMany(VendorPackage::class);
    }
}
