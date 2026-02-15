'use client';

import { useEffect, useState } from 'react';
import { guestsAPI } from '@/lib/api';
import { Guest } from '@/types';
import Link from 'next/link';
import AuthCheck from '@/components/AuthCheck';
import Navbar from '@/components/Navbar';

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    side: 'both' as const,
    rsvp_status: 'pending' as const,
    plus_ones: 0,
    dietary_restrictions: '',
    notes: '',
  });

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    try {
      const data = await guestsAPI.getAll();
      setGuests(data);
    } catch (error) {
      console.error('Failed to load guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await guestsAPI.create(formData);
      setShowForm(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        side: 'both',
        rsvp_status: 'pending',
        plus_ones: 0,
        dietary_restrictions: '',
        notes: '',
      });
      loadGuests();
    } catch (error) {
      console.error('Failed to create guest:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this guest?')) {
      try {
        await guestsAPI.delete(id);
        loadGuests();
      } catch (error) {
        console.error('Failed to delete guest:', error);
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'RSVP Status', 'Plus Ones', 'Dietary Restrictions'];
    const rows = guests.map(g => [
      g.name,
      g.email || '',
      g.phone || '',
      g.rsvp_status,
      g.plus_ones || 0,
      g.dietary_restrictions || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guest-list-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = {
    total: guests.length,
    confirmed: guests.filter(g => g.rsvp_status === 'confirmed').length,
    pending: guests.filter(g => g.rsvp_status === 'pending').length,
    declined: guests.filter(g => g.rsvp_status === 'declined').length,
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
            <h1 className="text-4xl font-bold">Guest List</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <span>📥</span>
              Export CSV
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {showForm ? 'Cancel' : 'Add Guest'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-gray-600">Total Guests</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <div className="text-gray-600">Confirmed</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
            <div className="text-gray-600">Declined</div>
          </div>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Add New Guest</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name *"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                value={formData.side}
                onChange={(e) => setFormData({ ...formData, side: e.target.value as any })}
                className="border p-2 rounded"
              >
                <option value="bride">Bride's Side</option>
                <option value="groom">Groom's Side</option>
                <option value="both">Both</option>
              </select>
              <select
                value={formData.rsvp_status}
                onChange={(e) => setFormData({ ...formData, rsvp_status: e.target.value as any })}
                className="border p-2 rounded"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="declined">Declined</option>
              </select>
              <input
                type="number"
                placeholder="Plus Ones"
                min="0"
                value={formData.plus_ones}
                onChange={(e) => setFormData({ ...formData, plus_ones: parseInt(e.target.value) })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Dietary Restrictions"
                value={formData.dietary_restrictions}
                onChange={(e) => setFormData({ ...formData, dietary_restrictions: e.target.value })}
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
                Add Guest
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Contact</th>
                <th className="px-6 py-3 text-left">Side</th>
                <th className="px-6 py-3 text-left">RSVP</th>
                <th className="px-6 py-3 text-left">Plus Ones</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={guest.id} className="border-t">
                  <td className="px-6 py-4">{guest.name}</td>
                  <td className="px-6 py-4">
                    {guest.email && <div className="text-sm">{guest.email}</div>}
                    {guest.phone && <div className="text-sm text-gray-600">{guest.phone}</div>}
                  </td>
                  <td className="px-6 py-4 capitalize">{guest.side}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      guest.rsvp_status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      guest.rsvp_status === 'declined' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {guest.rsvp_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{guest.plus_ones}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(guest.id)}
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
