'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tegabu-wedding-planner-system.onrender.com/api';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VendorProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    business_name: '',
    category: 'venue',
    description: '',
    location: '',
    starting_price: 0,
    phone: '',
    website: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'vendor') {
      alert('Only vendors can access this page');
      router.push('/');
      return;
    }

    loadProfile();
  }, [router]);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/my-vendor-profile`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data && data.id) {
        setProfile(data);
        setFormData({
          business_name: data.business_name,
          category: data.category,
          description: data.description,
          location: data.location,
          starting_price: data.starting_price,
          phone: data.phone || '',
          website: data.website || '',
        });
      } else {
        setShowForm(true);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      setShowForm(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth_token');
      const url = profile 
        ? `${API_URL}/vendor-profiles/${profile.id}`
        : `${API_URL}/vendor-profiles`;
      
      const response = await fetch(url, {
        method: profile ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(profile ? 'Profile updated!' : 'Profile created!');
        loadProfile();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">💍</span>
            <span className="font-semibold text-gray-800">Wedding Planner</span>
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">My Vendor Profile</h1>
            <p className="text-gray-600">Manage your business profile</p>
          </div>
          {profile && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>

        {showForm ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">
              {profile ? 'Edit Profile' : 'Create Your Vendor Profile'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Elegant Events Photography"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="venue">Venue</option>
                  <option value="catering">Catering</option>
                  <option value="photography">Photography</option>
                  <option value="videography">Videography</option>
                  <option value="florist">Florist</option>
                  <option value="music">Music/DJ</option>
                  <option value="decoration">Decoration</option>
                  <option value="makeup">Makeup & Hair</option>
                  <option value="transportation">Transportation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your services, experience, and what makes you special..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="City, State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Starting Price * ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.starting_price}
                    onChange={(e) => setFormData({ ...formData, starting_price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="1000"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                {profile && (
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  {profile ? 'Update Profile' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        ) : profile ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">{profile.business_name}</h2>
              <p className="text-xl text-gray-600 capitalize">{profile.category}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl mb-1">⭐</div>
                <div className="text-xl font-bold">{Number(profile.rating).toFixed(1)}</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl mb-1">📅</div>
                <div className="text-xl font-bold">{profile.total_bookings}</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl mb-1">💰</div>
                <div className="text-xl font-bold">${Number(profile.starting_price).toFixed(0)}</div>
                <div className="text-sm text-gray-600">Starting Price</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Description</h3>
                <p className="text-gray-600">{profile.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Location</h3>
                <p className="text-gray-600">📍 {profile.location}</p>
              </div>
              {profile.phone && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Phone</h3>
                  <p className="text-gray-600">📞 {profile.phone}</p>
                </div>
              )}
              {profile.website && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Website</h3>
                  <p className="text-gray-600">
                    🌐 <a href={profile.website} target="_blank" className="text-blue-600 hover:underline">{profile.website}</a>
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t">
              <Link
                href="/marketplace"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
              >
                View in Marketplace
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
