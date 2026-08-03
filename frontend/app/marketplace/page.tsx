'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tegabu-wedding-planner-system.onrender.com/api';

interface VendorProfile {
  id: number;
  business_name: string;
  category: string;
  description: string;
  location: string;
  starting_price: number;
  rating: number;
  total_bookings: number;
  is_verified: boolean;
  user: {
    name: string;
    email: string;
  };
}

export default function MarketplacePage() {
  const router = useRouter();
  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<VendorProfile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendors();
  }, []);

  useEffect(() => {
    filterVendors();
  }, [selectedCategory, searchLocation, vendors]);

  const loadVendors = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor-profiles`);
      if (!response.ok) {
        console.error('Failed to load vendors - Status:', response.status);
        setLoading(false);
        return;
      }
      const data = await response.json();
      setVendors(data);
      setFilteredVendors(data);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterVendors = () => {
    let filtered = vendors;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(v => v.category === selectedCategory);
    }

    if (searchLocation) {
      filtered = filtered.filter(v => 
        v.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    setFilteredVendors(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const categories = [
    { value: 'all', label: 'All Categories', icon: '🎯' },
    { value: 'venue', label: 'Venues', icon: '🏛️' },
    { value: 'catering', label: 'Catering', icon: '🍽️' },
    { value: 'photography', label: 'Photography', icon: '📸' },
    { value: 'videography', label: 'Videography', icon: '🎥' },
    { value: 'florist', label: 'Florist', icon: '💐' },
    { value: 'music', label: 'Music/DJ', icon: '🎵' },
    { value: 'decoration', label: 'Decoration', icon: '🎨' },
    { value: 'makeup', label: 'Makeup', icon: '💄' },
    { value: 'transportation', label: 'Transportation', icon: '🚗' },
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">💐</span>
            <span className="text-2xl font-serif bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent" style={{ letterSpacing: '0.05em' }}>Tegabu</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/vendors-category" className="text-gray-600 hover:text-rose-600">
              Categories
            </Link>
            {localStorage.getItem('auth_token') ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-rose-600">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-rose-600">
                  Login
                </Link>
                <Link href="/register" className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Vendor Marketplace</h1>
          <p className="text-gray-600">Browse and book wedding vendors</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Search by location..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Vendor Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <Link
              key={vendor.id}
              href={`/marketplace/${vendor.id}`}
              className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-6xl">
                {categories.find(c => c.value === vendor.category)?.icon || '🎉'}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold">{vendor.business_name}</h3>
                  {vendor.is_verified && (
                    <span className="text-blue-500 text-xl" title="Verified">✓</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 capitalize mb-2">{vendor.category}</p>
                <p className="text-gray-700 mb-3 line-clamp-2">{vendor.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-semibold">{Number(vendor.rating).toFixed(1)}</span>
                    <span className="text-gray-500">({vendor.total_bookings} bookings)</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <span className="text-gray-600">📍 {vendor.location}</span>
                  <span className="font-semibold text-green-600">
                    From ${Number(vendor.starting_price).toFixed(0)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No vendors found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
