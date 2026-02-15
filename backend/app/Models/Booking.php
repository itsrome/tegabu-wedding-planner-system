<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'client_id',
        'vendor_profile_id',
        'event_date',
        'status',
        'quoted_price',
        'special_requests',
        'vendor_notes',
    ];

    protected $casts = [
        'event_date' => 'date',
        'quoted_price' => 'decimal:2',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function vendorProfile()
    {
        return $this->belongsTo(VendorProfile::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }
}
