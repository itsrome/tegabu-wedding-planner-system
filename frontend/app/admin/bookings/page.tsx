'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tegabu-wedding-planner-system.onrender.com/api';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AuthCheck from '@/components/AuthCheck';

interface Booking {
  id: number;
  user_id: number;
  vendor_profile_id: number;
  event_date: string;
  status: string;
  quoted_price: number | null;
  created_at: string;
  user: {
    name: string;
    email: string;
  };
  vendorProfile: {
    business_name: string;
    category: string;
  };
}

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role !== 'admin') {
        alert('Access denied. Admin only.');
        router.push('/dashboard');
        return;
      }
    }
    loadBookings();
  }, [router]);

  const loadBookings = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('${API_URL}/admin/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (id: number) => {
    if (!confirm('Delete this booking? This cannot be undone.')) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        alert('✅ Booking deleted');
        loadBookings();
      }
    } catch (error) {
      alert('Failed to delete booking');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <AuthCheck>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </AuthCheck>
    );
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link href="/admin" className="text-red-600 hover:text-red-700 mb-4 inline-block">
              ← Back to Admin
            </Link>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">All Bookings</h1>
            <p className="text-gray-600">Manage all platform bookings</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Client</th>
                  <th className="text-left py-3 px-4">Vendor</th>
                  <th className="text-left py-3 px-4">Event Date</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{booking.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold">{booking.user.name}</div>
                      <div className="text-sm text-gray-500">{booking.user.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold">{booking.vendorProfile.business_name}</div>
                      <div className="text-sm text-gray-500 capitalize">{booking.vendorProfile.category}</div>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(booking.event_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {booking.quoted_price ? `$${Number(booking.quoted_price).toLocaleString()}` : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="text-red-600 hover:text-red-800 font-semibold text-sm"
                      >
                        🗑️ Delete
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
