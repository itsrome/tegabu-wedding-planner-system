<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'category',
        'contact_person',
        'email',
        'phone',
        'cost',
        'deposit_paid',
        'status',
        'notes',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
        'deposit_paid' => 'decimal:2',
    ];
}
