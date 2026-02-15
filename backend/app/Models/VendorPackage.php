<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorPackage extends Model
{
    protected $fillable = [
        'vendor_profile_id',
        'package_name',
        'description',
        'price',
        'features',
        'is_popular',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'features' => 'array',
        'is_popular' => 'boolean',
    ];

    public function vendorProfile()
    {
        return $this->belongsTo(VendorProfile::class);
    }
}
