<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'side',
        'rsvp_status',
        'plus_ones',
        'dietary_restrictions',
        'notes',
    ];

    protected $casts = [
        'plus_ones' => 'integer',
    ];
}
