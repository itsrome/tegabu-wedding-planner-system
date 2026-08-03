'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tegabu-wedding-planner-system.onrender.com/api';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AuthCheck from '@/components/AuthCheck';

interface Booking {
  id: number;
  vendor_profile_id: number;
  event_date: string;
  special_requests: string;
  status: string;
  quoted_price: number | null;
  vendor_notes: string | null;
  created_at: string;
  vendorProfile: {
    id: number;
    business_name: string;
    category: string;
    location: string;
    user: {
      name: string;
      email: string;
    };
  };
  review?: {
    id: number;
    rating: number;
    comment: string;
  };
}

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState<number | null>(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
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

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      venue: '🏛️',
      catering: '🍽️',
      photography: '📸',
      videography: '🎥',
      florist: '💐',
      music: '🎵',
      decoration: '🎨',
      makeup: '💄',
      transportation: '🚗',
    };
    return icons[category] || '🎉';
  };

  const submitReview = async (bookingId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id: bookingId,
          rating: reviewData.rating,
          comment: reviewData.comment,
        }),
      });

      if (response.ok) {
        alert('✅ Review submitted successfully!');
        setShowReviewForm(null);
        setReviewData({ rating: 5, comment: '' });
        loadBookings(); // Reload to show the review
      } else {
        const error = await response.json();
        alert(`Failed to submit review: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <AuthCheck>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">💐</div>
            <div className="text-xl text-gray-600">Loading bookings...</div>
          </div>
        </div>
      </AuthCheck>
    );
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link href="/dashboard" className="text-rose-600 hover:text-rose-700 mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
              My Bookings
            </h1>
            <p className="text-gray-600">Manage your vendor bookings</p>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-semibold mb-2">No Bookings Yet</h3>
              <p className="text-gray-600 mb-6">Start booking vendors for your wedding!</p>
              <Link
                href="/marketplace"
                className="inline-block bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors"
              >
                Browse Vendors
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="text-5xl">{getCategoryIcon(booking.vendorProfile.category)}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{booking.vendorProfile.business_name}</h3>
                        <p className="text-gray-600 capitalize">{booking.vendorProfile.category}</p>
                        <p className="text-sm text-gray-500">📍 {booking.vendorProfile.location}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Event Date</div>
                      <div className="font-semibold text-lg">
                        📅 {new Date(booking.event_date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>

                    {booking.quoted_price && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Quoted Price</div>
                        <div className="font-semibold text-lg text-green-600">
                          💰 ${Number(booking.quoted_price).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>

                  {booking.special_requests && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-1">Your Special Requests</div>
                      <div className="bg-blue-50 p-3 rounded-lg text-gray-700">
                        {booking.special_requests}
                      </div>
                    </div>
                  )}

                  {booking.vendor_notes && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-1">Vendor Notes</div>
                      <div className="bg-purple-50 p-3 rounded-lg text-gray-700">
                        {booking.vendor_notes}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t">
                    <Link
                      href={`/marketplace/${booking.vendor_profile_id}`}
                      className="flex-1 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors text-center"
                    >
                      View Vendor
                    </Link>
                    <Link
                      href={`/messages`}
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-center"
                    >
                      💬 Message
                    </Link>
                    {booking.status === 'completed' && !booking.review && (
                      <button
                        onClick={() => setShowReviewForm(booking.id)}
                        className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                      >
                        ⭐ Leave Review
                      </button>
                    )}
                  </div>

                  {/* Review Form */}
                  {showReviewForm === booking.id && (
                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                      <h4 className="font-semibold mb-3">Leave a Review</h4>
                      
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setReviewData({ ...reviewData, rating: star })}
                              className={`text-3xl ${
                                star <= reviewData.rating ? 'text-yellow-500' : 'text-gray-300'
                              }`}
                            >
                              ⭐
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Comment (Optional)
                        </label>
                        <textarea
                          value={reviewData.comment}
                          onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                          placeholder="Share your experience with this vendor..."
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => submitReview(booking.id)}
                          className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                        >
                          Submit Review
                        </button>
                        <button
                          onClick={() => {
                            setShowReviewForm(null);
                            setReviewData({ rating: 5, comment: '' });
                          }}
                          className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Existing Review */}
                  {booking.review && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Your Review</h4>
                        <div className="text-yellow-500">
                          {'⭐'.repeat(booking.review.rating)}
                        </div>
                      </div>
                      {booking.review.comment && (
                        <p className="text-gray-700">{booking.review.comment}</p>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-gray-400 mt-3">
                    Booked on {new Date(booking.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthCheck>
  );
}
