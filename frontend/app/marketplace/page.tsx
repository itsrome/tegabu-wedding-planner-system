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
  user: { name: string; email: string };
}

const categoryConfig: Record<string, { icon: string; color: string }> = {
  'Photography':        { icon: '📸', color: 'from-blue-400 to-blue-500' },
  'Catering':           { icon: '🍽️', color: 'from-orange-400 to-orange-500' },
  'Venue':              { icon: '🏛️', color: 'from-purple-400 to-purple-500' },
  'Music & Entertainment': { icon: '🎵', color: 'from-green-400 to-green-500' },
  'Decoration':         { icon: '🎨', color: 'from-yellow-400 to-yellow-500' },
  'Wedding Cake':       { icon: '🎂', color: 'from-pink-400 to-pink-500' },
  'Transportation':     { icon: '🚗', color: 'from-gray-400 to-gray-500' },
  'Hair & Makeup':      { icon: '💄', color: 'from-rose-400 to-rose-500' },
  'Videography':        { icon: '🎥', color: 'from-indigo-400 to-indigo-500' },
};

export default function MarketplacePage() {
  const router = useRouter();
  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadVendors(); }, []);

  const loadVendors = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor-profiles`);
      if (!response.ok) { setLoading(false); return; }
      const data = await response.json();
      setVendors(data);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const filteredVendors = searchLocation
    ? vendors.filter(v => v.location.toLowerCase().includes(searchLocation.toLowerCase()))
    : vendors;

  // Group vendors by category
  const grouped = Object.keys(categoryConfig).reduce((acc, cat) => {
    const list = filteredVendors.filter(v => v.category === cat);
    if (list.length > 0) acc[cat] = list;
    return acc;
  }, {} as Record<string, VendorProfile[]>);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading vendors...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">💐</span>
            <span className="text-2xl font-serif bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">Tegabu</span>
          </Link>
          <div className="flex items-center gap-4">
            {typeof window !== 'undefined' && localStorage.getItem('auth_token') ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-rose-600">Dashboard</Link>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-rose-600">Login</Link>
                <Link href="/register" className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 text-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Vendor Marketplace</h1>
          <p className="text-gray-600">Browse wedding vendors by category</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <input
            type="text"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            placeholder="🔍 Search by location..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Grouped by Category */}
        {Object.entries(grouped).map(([category, vendorList]) => {
          const config = categoryConfig[category];
          return (
            <div key={category} className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{config.icon}</span>
                <h2 className="text-2xl font-bold text-gray-800">{category}</h2>
                <span className="text-gray-500 text-sm">({vendorList.length} vendors)</span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {vendorList.map((vendor) => (
                  <Link
                    key={vendor.id}
                    href={`/marketplace/${vendor.id}`}
                    className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden"
                  >
                    <div className={`h-36 bg-gradient-to-br ${config.color} flex items-center justify-center text-5xl`}>
                      {config.icon}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-800 text-sm leading-tight">{vendor.business_name}</h3>
                        {vendor.is_verified && <span className="text-blue-500 text-sm ml-1">✓</span>}
                      </div>
                      <p className="text-gray-600 text-xs mb-2 line-clamp-2">{vendor.description}</p>
                      <div className="flex items-center gap-1 text-xs mb-2">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-semibold">{Number(vendor.rating).toFixed(1)}</span>
                        <span className="text-gray-400">({vendor.total_bookings})</span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-2 border-t">
                        <span className="text-gray-500">📍 {vendor.location}</span>
                        <span className="font-bold text-green-600">From ${Number(vendor.starting_price).toFixed(0)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {Object.keys(grouped).length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No vendors found</h3>
            <p className="text-gray-600">Try a different location</p>
          </div>
        )}
      </div>
    </div>
  );
}
