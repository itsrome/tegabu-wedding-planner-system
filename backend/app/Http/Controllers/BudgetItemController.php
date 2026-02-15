<?php

namespace App\Http\Controllers;

use App\Models\BudgetItem;
use Illuminate\Http\Request;

class BudgetItemController extends Controller
{
    public function index(Request $request)
    {
        $items = BudgetItem::where('user_id', $request->user()->id)->get();
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'item_name' => 'required|string|max:255',
            'estimated_cost' => 'nullable|numeric|min:0',
            'actual_cost' => 'nullable|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $validated['user_id'] = $request->user()->id;
        $budgetItem = BudgetItem::create($validated);
        return response()->json($budgetItem, 201);
    }

    public function show(BudgetItem $budgetItem)
    {
        return response()->json($budgetItem);
    }

    public function update(Request $request, BudgetItem $budgetItem)
    {
        $validated = $request->validate([
            'category' => 'sometimes|string|max:255',
            'item_name' => 'sometimes|string|max:255',
            'estimated_cost' => 'nullable|numeric|min:0',
            'actual_cost' => 'nullable|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $budgetItem->update($validated);
        return response()->json($budgetItem);
    }

    public function destroy(BudgetItem $budgetItem)
    {
        $budgetItem->delete();
        return response()->json(null, 204);
    }

    public function summary(Request $request)
    {
        $items = BudgetItem::where('user_id', $request->user()->id)->get();
        
        return response()->json([
            'total_estimated' => $items->sum('estimated_cost'),
            'total_actual' => $items->sum('actual_cost'),
            'total_paid' => $items->sum('paid_amount'),
            'remaining' => $items->sum('actual_cost') - $items->sum('paid_amount'),
        ]);
    }
}
