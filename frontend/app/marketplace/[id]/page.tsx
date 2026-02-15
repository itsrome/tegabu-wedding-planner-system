'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function VendorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [vendor, setVendor] = useState<any>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    event_date: '',
    special_requests: '',
  });
  const [loading, setLoading] = useState(true);
  const [tokenInvalid, setTokenInvalid] = useState(false);

  useEffect(() => {
    loadVendor();
    
    // Check if token is valid on page load
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await fetch('http://localhost:8000/api/user', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!response.ok) {
            console.log('Invalid token detected, clearing...');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            setTokenInvalid(true);
          }
        } catch (error) {
          console.log('Auth check failed, clearing token...');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          setTokenInvalid(true);
        }
      }
    };
    
    checkAuth();
  }, []);

  const loadVendor = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/vendor-profiles/${params.id}`);
      const data = await response.json();
      setVendor(data);
    } catch (error) {
      console.error('Failed to load vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('auth_token');
    if (!token) {
      if (confirm('You need to login to make a booking. Go to login page?')) {
        router.push('/login');
      }
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/bookings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vendor_profile_id: params.id,
          event_date: bookingData.event_date,
          special_requests: bookingData.special_requests,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        if (confirm('Your session has expired. Please clear your browser data and login again.\n\nSteps:\n1. Press F12\n2. Type: localStorage.clear()\n3. Refresh page\n4. Register new account\n\nGo to login page now?')) {
          router.push('/login');
        }
        return;
      }

      if (response.status === 500) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        alert('Authentication error. Your token is invalid.\n\nPlease:\n1. Press F12 (open console)\n2. Type: localStorage.clear()\n3. Press Enter\n4. Refresh page (F5)\n5. Register a NEW account\n6. Try booking again');
        return;
      }

      if (response.ok) {
        alert('✅ Booking request sent successfully!');
        setShowBookingForm(false);
        setBookingData({ event_date: '', special_requests: '' });
      } else {
        const errorText = await response.text();
        console.error('Booking error:', errorText);
        alert(`Failed to create booking. Please try again or contact support.`);
      }
    } catch (error) {
      console.error('Failed to create booking:', error);
      alert('❌ Cannot connect to server.\n\nPlease check:\n1. Backend is running (http://localhost:8000)\n2. Your internet connection\n3. Browser console for errors (F12)');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!vendor) {
    return <div className="min-h-screen flex items-center justify-center">Vendor not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">💐</span>
            <span className="text-2xl font-serif bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent" style={{ letterSpacing: '0.05em' }}>Tegabu</span>
          </Link>
          <Link href="/marketplace" className="text-rose-600 hover:text-rose-700">
            ← Back to Marketplace
          </Link>
        </div>
      </nav>

      {tokenInvalid && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <div className="container mx-auto">
            <p className="font-bold">⚠️ Your session was invalid and has been cleared</p>
            <p>Please <Link href="/register" className="underline font-semibold">register a new account</Link> or <Link href="/login" className="underline font-semibold">login</Link> to make bookings.</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-64 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-9xl">
            🎉
          </div>

          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{vendor.business_name}</h1>
                <p className="text-xl text-gray-600 capitalize">{vendor.category}</p>
              </div>
              {vendor.is_verified && (
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full flex items-center gap-2">
                  ✓ Verified Vendor
                </span>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-2xl font-bold">{Number(vendor.rating).toFixed(1)}</div>
                <div className="text-gray-600">Rating</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-3xl mb-2">📅</div>
                <div className="text-2xl font-bold">{vendor.total_bookings}</div>
                <div className="text-gray-600">Bookings</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-2xl font-bold">${Number(vendor.starting_price).toFixed(0)}</div>
                <div className="text-gray-600">Starting Price</div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">{vendor.description}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-2">
                <p className="text-gray-700">📍 Location: {vendor.location}</p>
                {vendor.phone && <p className="text-gray-700">📞 Phone: {vendor.phone}</p>}
                {vendor.website && (
                  <p className="text-gray-700">
                    🌐 Website: <a href={vendor.website} target="_blank" className="text-blue-600 hover:underline">{vendor.website}</a>
                  </p>
                )}
                <p className="text-gray-700">✉️ Email: {vendor.user.email}</p>
              </div>
            </div>

            {vendor.reviews && vendor.reviews.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Reviews ({vendor.reviews.length})</h2>
                <div className="space-y-4">
                  {vendor.reviews.map((review: any) => (
                    <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500 text-xl">{'⭐'.repeat(review.rating)}</span>
                          <span className="font-semibold">{review.client?.name || 'Anonymous'}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && <p className="text-gray-700">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setShowBookingForm(!showBookingForm)}
                className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 text-lg font-semibold"
              >
                📅 Request Booking
              </button>
              <Link
                href={`/messages?user=${vendor.user_id}`}
                className="flex-1 bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 text-lg font-semibold text-center"
              >
                💬 Message Vendor
              </Link>
            </div>

            {showBookingForm && (
              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Request Booking</h3>
                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingData.event_date}
                      onChange={(e) => setBookingData({ ...bookingData, event_date: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests
                    </label>
                    <textarea
                      value={bookingData.special_requests}
                      onChange={(e) => setBookingData({ ...bookingData, special_requests: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell the vendor about your requirements..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Send Booking Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
