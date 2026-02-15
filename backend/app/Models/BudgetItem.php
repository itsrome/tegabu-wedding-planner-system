<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BudgetItem extends Model
{
    protected $fillable = [
        'user_id',
        'category',
        'item_name',
        'estimated_cost',
        'actual_cost',
        'paid_amount',
        'notes',
    ];

    protected $casts = [
        'estimated_cost' => 'decimal:2',
        'actual_cost' => 'decimal:2',
        'paid_amount' => 'decimal:2',
    ];
}
