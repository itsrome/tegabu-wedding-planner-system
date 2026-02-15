'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VendorCategoriesPage() {
  const router = useRouter();

  const categories = [
    { 
      id: 'venue', 
      name: 'Venues', 
      icon: '🏛️',
      description: 'Wedding venues, banquet halls, outdoor spaces',
      color: 'from-purple-400 to-pink-400'
    },
    { 
      id: 'catering', 
      name: 'Catering', 
      icon: '🍽️',
      description: 'Food & beverage services, bartenders',
      color: 'from-orange-400 to-red-400'
    },
    { 
      id: 'photography', 
      name: 'Photography', 
      icon: '📸',
      description: 'Wedding photographers, photo booths',
      color: 'from-blue-400 to-cyan-400'
    },
    { 
      id: 'videography', 
      name: 'Videography', 
      icon: '🎥',
      description: 'Wedding videographers, drone services',
      color: 'from-indigo-400 to-purple-400'
    },
    { 
      id: 'florist', 
      name: 'Florists', 
      icon: '💐',
      description: 'Flowers, bouquets, centerpieces',
      color: 'from-pink-400 to-rose-400'
    },
    { 
      id: 'music', 
      name: 'Music & DJ', 
      icon: '🎵',
      description: 'DJs, bands, ceremony musicians',
      color: 'from-green-400 to-teal-400'
    },
    { 
      id: 'decoration', 
      name: 'Decoration', 
      icon: '🎨',
      description: 'Event decorators, lighting, draping',
      color: 'from-yellow-400 to-orange-400'
    },
    { 
      id: 'makeup', 
      name: 'Bridal Salons', 
      icon: '💄',
      description: 'Makeup artists, hair stylists, bridal beauty',
      color: 'from-pink-400 to-purple-400'
    },
    { 
      id: 'transportation', 
      name: 'Transportation', 
      icon: '🚗',
      description: 'Limos, vintage cars, shuttles',
      color: 'from-gray-400 to-slate-400'
    },
    { 
      id: 'other', 
      name: 'Other Services', 
      icon: '✨',
      description: 'Planners, officiants, and more',
      color: 'from-violet-400 to-purple-400'
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">💍</span>
            <span className="text-2xl font-bold text-gray-800">WeddingPlanner</span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Banner */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Find Your Perfect Vendors</h1>
          <p className="text-xl opacity-90">Browse by category to find the best wedding professionals</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/vendors-category/${category.id}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all overflow-hidden"
            >
              <div className={`h-32 bg-gradient-to-br ${category.color} flex items-center justify-center text-6xl`}>
                {category.icon}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-pink-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600">{category.description}</p>
                <div className="mt-4 text-pink-600 font-semibold flex items-center gap-2">
                  Browse {category.name}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
