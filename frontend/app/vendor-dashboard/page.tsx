'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tegabu-wedding-planner-system.onrender.com/api';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AuthCheck from '@/components/AuthCheck';

interface Booking {
  id: number;
  event_date: string;
  special_requests: string;
  status: string;
  quoted_price: number | null;
  vendor_notes: string | null;
  client: {
    id: number;
    name: string;
    email: string;
  };
}

export default function VendorDashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingBooking, setUpdatingBooking] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Load bookings
      const bookingsRes = await fetch(`${API_URL}/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        setBookings(data);
      }

      // Load vendor profile
      const profileRes = await fetch(`${API_URL}/my-vendor-profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: number, status: string, quotedPrice?: number) => {
    setUpdatingBooking(bookingId);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          quoted_price: quotedPrice,
        }),
      });

      if (response.ok) {
        alert(`Booking ${status}!`);
        loadData();
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
      alert('Failed to update booking');
    } finally {
      setUpdatingBooking(null);
    }
  };

  const handleAccept = (bookingId: number) => {
    const price = prompt('Enter quoted price for this booking:');
    if (price) {
      updateBookingStatus(bookingId, 'confirmed', parseFloat(price));
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
          <div className="text-center">
            <div className="text-5xl mb-4">💐</div>
            <div className="text-xl text-gray-600">Loading dashboard...</div>
          </div>
        </div>
      </AuthCheck>
    );
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Vendor Dashboard
            </h1>
            <p className="text-gray-600">Manage your bookings and profile</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-2">📋</div>
              <div className="text-3xl font-bold text-gray-800">{bookings.length}</div>
              <div className="text-gray-600">Total Bookings</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-2">⏳</div>
              <div className="text-3xl font-bold text-yellow-600">{pendingBookings.length}</div>
              <div className="text-gray-600">Pending</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-2">✅</div>
              <div className="text-3xl font-bold text-green-600">{confirmedBookings.length}</div>
              <div className="text-gray-600">Confirmed</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-2">🎉</div>
              <div className="text-3xl font-bold text-blue-600">{completedBookings.length}</div>
              <div className="text-gray-600">Completed</div>
            </div>
          </div>

          {/* Profile Info */}
          {profile && (
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Business Name</div>
                  <div className="font-semibold text-lg">{profile.business_name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Category</div>
                  <div className="font-semibold text-lg capitalize">{profile.category}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Rating</div>
                  <div className="font-semibold text-lg">⭐ {Number(profile.rating).toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                  <div className="font-semibold text-lg">{profile.total_bookings}</div>
                </div>
              </div>
            </div>
          )}

          {/* Bookings List */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Booking Requests</h2>

            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
                <p className="text-gray-600">Bookings will appear here when clients request your services</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{booking.client.name}</h3>
                        <p className="text-gray-600">{booking.client.email}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Event Date</div>
                        <div className="font-semibold">
                          {new Date(booking.event_date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      {booking.quoted_price && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">Quoted Price</div>
                          <div className="font-semibold text-green-600">
                            ${Number(booking.quoted_price).toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>

                    {booking.special_requests && (
                      <div className="mb-4">
                        <div className="text-sm text-gray-600 mb-1">Special Requests</div>
                        <div className="bg-blue-50 p-3 rounded-lg text-gray-700">
                          {booking.special_requests}
                        </div>
                      </div>
                    )}

                    {booking.status === 'pending' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAccept(booking.id)}
                          disabled={updatingBooking === booking.id}
                          className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          ✅ Accept & Quote Price
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          disabled={updatingBooking === booking.id}
                          className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          ❌ Decline
                        </button>
                      </div>
                    )}

                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                        disabled={updatingBooking === booking.id}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                      >
                        ✓ Mark as Completed
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}
