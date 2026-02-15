'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function CategoryVendorsPage() {
  const params = useParams();
  const router = useRouter();
  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');

  const categoryInfo: any = {
    venue: { name: 'Venues', icon: '🏛️', color: 'purple' },
    catering: { name: 'Catering', icon: '🍽️', color: 'orange' },
    photography: { name: 'Photography', icon: '📸', color: 'blue' },
    videography: { name: 'Videography', icon: '🎥', color: 'indigo' },
    florist: { name: 'Florists', icon: '💐', color: 'pink' },
    music: { name: 'Music & DJ', icon: '🎵', color: 'green' },
    decoration: { name: 'Decoration', icon: '🎨', color: 'yellow' },
    makeup: { name: 'Bridal Salons', icon: '💄', color: 'pink' },
    transportation: { name: 'Transportation', icon: '🚗', color: 'gray' },
    other: { name: 'Other Services', icon: '✨', color: 'violet' },
  };

  const currentCategory = categoryInfo[params.category as string] || categoryInfo.other;

  useEffect(() => {
    loadVendors();
  }, [params.category]);

  const loadVendors = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/vendor-profiles?category=${params.category}`);
      const data = await response.json();
      setVendors(data);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = searchLocation
    ? vendors.filter(v => v.location.toLowerCase().includes(searchLocation.toLowerCase()))
    : vendors;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">💍</span>
            <span className="text-2xl font-bold text-gray-800">WeddingPlanner</span>
          </Link>
          <Link href="/vendors-category" className="text-gray-600 hover:text-gray-800 font-medium">
            ← All Categories
          </Link>
        </div>
      </nav>

      {/* Category Header */}
      <div className={`bg-gradient-to-r from-${currentCategory.color}-500 to-${currentCategory.color}-600 py-12`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 text-white mb-4">
            <span className="text-6xl">{currentCategory.icon}</span>
            <div>
              <h1 className="text-4xl font-bold">{currentCategory.name}</h1>
              <p className="text-xl opacity-90">{filteredVendors.length} vendors available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by Location
            </label>
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Enter city or state..."
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Vendors List */}
      <div className="container mx-auto px-4 py-8">
        {filteredVendors.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold mb-2">No vendors found</h3>
            <p className="text-gray-600">Try adjusting your search or check back later</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <Link
                key={vendor.id}
                href={`/marketplace/${vendor.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all overflow-hidden group"
              >
                <div className={`h-48 bg-gradient-to-br from-${currentCategory.color}-400 to-${currentCategory.color}-500 flex items-center justify-center text-7xl`}>
                  {currentCategory.icon}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold group-hover:text-pink-600 transition-colors">
                      {vendor.business_name}
                    </h3>
                    {vendor.is_verified && (
                      <span className="text-blue-500 text-xl" title="Verified">✓</span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-2">{vendor.description}</p>
                  
                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-semibold">{Number(vendor.rating).toFixed(1)}</span>
                      <span className="text-gray-500">({vendor.total_bookings})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-gray-600 text-sm">📍 {vendor.location}</span>
                    <span className="font-bold text-green-600">
                      From ${Number(vendor.starting_price).toFixed(0)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
