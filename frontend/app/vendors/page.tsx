'use client';

import { useEffect, useState } from 'react';
import { vendorsAPI } from '@/lib/api';
import { Vendor } from '@/types';
import Link from 'next/link';
import AuthCheck from '@/components/AuthCheck';
import Navbar from '@/components/Navbar';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'venue' as const,
    contact_person: '',
    email: '',
    phone: '',
    cost: 0,
    deposit_paid: 0,
    status: 'pending' as const,
    notes: '',
  });

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const data = await vendorsAPI.getAll();
      setVendors(data);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await vendorsAPI.create(formData);
      setShowForm(false);
      setFormData({
        name: '',
        category: 'venue',
        contact_person: '',
        email: '',
        phone: '',
        cost: 0,
        deposit_paid: 0,
        status: 'pending',
        notes: '',
      });
      loadVendors();
    } catch (error) {
      console.error('Failed to create vendor:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      try {
        await vendorsAPI.delete(id);
        loadVendors();
      } catch (error) {
        console.error('Failed to delete vendor:', error);
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
            <h1 className="text-4xl font-bold">Vendors</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Add Vendor'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Add New Vendor</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Vendor Name *"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border p-2 rounded"
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="border p-2 rounded"
              >
                <option value="venue">Venue</option>
                <option value="catering">Catering</option>
                <option value="photography">Photography</option>
                <option value="videography">Videography</option>
                <option value="florist">Florist</option>
                <option value="music">Music</option>
                <option value="decoration">Decoration</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Contact Person"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border p-2 rounded"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="border p-2 rounded"
              >
                <option value="pending">Pending</option>
                <option value="booked">Booked</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <input
                type="number"
                placeholder="Total Cost"
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Deposit Paid"
                min="0"
                step="0.01"
                value={formData.deposit_paid}
                onChange={(e) => setFormData({ ...formData, deposit_paid: parseFloat(e.target.value) })}
                className="border p-2 rounded"
              />
              <textarea
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="border p-2 rounded col-span-2"
                rows={3}
              />
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 col-span-2">
                Add Vendor
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Contact</th>
                <th className="px-6 py-3 text-left">Cost</th>
                <th className="px-6 py-3 text-left">Deposit</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="border-t">
                  <td className="px-6 py-4 font-medium">{vendor.name}</td>
                  <td className="px-6 py-4 capitalize">{vendor.category}</td>
                  <td className="px-6 py-4">
                    {vendor.contact_person && <div className="text-sm">{vendor.contact_person}</div>}
                    {vendor.email && <div className="text-sm text-gray-600">{vendor.email}</div>}
                  </td>
                  <td className="px-6 py-4">${Number(vendor.cost).toFixed(2)}</td>
                  <td className="px-6 py-4">${Number(vendor.deposit_paid).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm capitalize ${
                      vendor.status === 'paid' ? 'bg-green-100 text-green-800' :
                      vendor.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                      vendor.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(vendor.id)}
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
