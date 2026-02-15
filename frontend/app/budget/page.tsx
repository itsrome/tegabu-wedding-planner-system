'use client';

import { useEffect, useState } from 'react';
import { budgetAPI } from '@/lib/api';
import { BudgetItem, BudgetSummary } from '@/types';
import Link from 'next/link';
import AuthCheck from '@/components/AuthCheck';
import Navbar from '@/components/Navbar';

export default function BudgetPage() {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    item_name: '',
    estimated_cost: 0,
    actual_cost: 0,
    paid_amount: 0,
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const [itemsData, summaryData] = await Promise.all([
        budgetAPI.getAll(),
        budgetAPI.getSummary(),
      ]);
      setItems(itemsData);
      setSummary(summaryData);
    } catch (error: any) {
      console.error('Failed to load budget data:', error);
      // If authentication error, clear token and redirect
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await budgetAPI.create(formData);
      setShowForm(false);
      setFormData({
        category: '',
        item_name: '',
        estimated_cost: 0,
        actual_cost: 0,
        paid_amount: 0,
        notes: '',
      });
      loadData();
    } catch (error) {
      console.error('Failed to create budget item:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await budgetAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <AuthCheck>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="text-blue-600 hover:underline mb-2 block">← Back to Home</Link>
            <h1 className="text-4xl font-bold">Budget Tracker</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Add Item'}
          </button>
        </div>

        {summary && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <div className="text-3xl font-bold text-blue-600">${Number(summary.total_estimated).toFixed(2)}</div>
              <div className="text-gray-600">Estimated Total</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg shadow">
              <div className="text-3xl font-bold text-purple-600">${Number(summary.total_actual).toFixed(2)}</div>
              <div className="text-gray-600">Actual Total</div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow">
              <div className="text-3xl font-bold text-green-600">${Number(summary.total_paid).toFixed(2)}</div>
              <div className="text-gray-600">Total Paid</div>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg shadow">
              <div className="text-3xl font-bold text-orange-600">${Number(summary.remaining).toFixed(2)}</div>
              <div className="text-gray-600">Remaining</div>
            </div>
          </div>
        )}

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Add Budget Item</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Category *"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Item Name *"
                required
                value={formData.item_name}
                onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Estimated Cost"
                min="0"
                step="0.01"
                value={formData.estimated_cost}
                onChange={(e) => setFormData({ ...formData, estimated_cost: parseFloat(e.target.value) })}
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Actual Cost"
                min="0"
                step="0.01"
                value={formData.actual_cost}
                onChange={(e) => setFormData({ ...formData, actual_cost: parseFloat(e.target.value) })}
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Paid Amount"
                min="0"
                step="0.01"
                value={formData.paid_amount}
                onChange={(e) => setFormData({ ...formData, paid_amount: parseFloat(e.target.value) })}
                className="border p-2 rounded col-span-2"
              />
              <textarea
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="border p-2 rounded col-span-2"
                rows={3}
              />
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 col-span-2">
                Add Item
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Item</th>
                <th className="px-6 py-3 text-left">Estimated</th>
                <th className="px-6 py-3 text-left">Actual</th>
                <th className="px-6 py-3 text-left">Paid</th>
                <th className="px-6 py-3 text-left">Remaining</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4 font-medium">{item.item_name}</td>
                  <td className="px-6 py-4">${Number(item.estimated_cost).toFixed(2)}</td>
                  <td className="px-6 py-4">${Number(item.actual_cost).toFixed(2)}</td>
                  <td className="px-6 py-4">${Number(item.paid_amount).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={Number(item.actual_cost) - Number(item.paid_amount) > 0 ? 'text-orange-600' : 'text-green-600'}>
                      ${(Number(item.actual_cost) - Number(item.paid_amount)).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </AuthCheck>
  );
}
