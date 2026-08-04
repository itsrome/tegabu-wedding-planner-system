'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error loading user:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-rose-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <span className="text-3xl">💐</span>
                <span className="text-3xl font-serif font-bold tracking-wide bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent" style={{ fontFamily: 'Georgia, serif' }}>
                  Tegabu
                </span>
              </div>
              <div className="hidden md:flex gap-6">
                <Link href="/dashboard" className="text-gray-700 hover:text-rose-600 font-medium transition-colors">
                  Dashboard
                </Link>
                <Link href="/marketplace" className="text-gray-700 hover:text-rose-600 font-medium transition-colors">
                  Find Vendors
                </Link>
                <Link href="/messages" className="text-gray-700 hover:text-rose-600 font-medium transition-colors">
                  Messages
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-gray-600 hidden md:block">Hi, {user.name}</span>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-rose-600 transition-colors font-medium"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-rose-600 transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Banner */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="text-4xl md:text-6xl mb-6">💐✨💍</div>
          <h1 className="text-3xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            Your Dream Wedding Starts Here
          </h1>
          <p className="text-base md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Welcome to Tegabu - where planning your perfect wedding is easy and fun
          </p>
          <Link
            href="/vendors-category"
            className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all"
          >
            Browse Vendors by Category
          </Link>
        </div>
      </div>

      {/* About Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center bg-white rounded-3xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-3 text-gray-800">About Tegabu</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Tegabu helps you plan your dream wedding easily. Track your budget, manage guests, find vendors, and stay organized - all in one place.
          </p>
        </div>
      </div>

      {/* Main Features */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Your Wedding Planning Tools</h2>
        
        {!user && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-blue-800">
              <span className="font-semibold">👋 Welcome!</span> You can browse our features below. 
              <Link href="/login" className="text-blue-600 hover:underline font-semibold ml-1">
                Sign in
              </Link> or 
              <Link href="/register" className="text-blue-600 hover:underline font-semibold ml-1">
                register
              </Link> to start planning your wedding!
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {user ? (
            <>
              <Link href="/dashboard" className="group bg-white rounded-2xl p-4 md:p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="text-3xl md:text-5xl mb-2 md:mb-4">📊</div>
                <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 group-hover:text-rose-600 transition-colors">Dashboard</h3>
                <p className="text-gray-600 text-xs md:text-base">View statistics and countdown</p>
              </Link>

              {user?.role === 'vendor' && (
                <Link href="/vendor-profile" className="group bg-white rounded-2xl p-4 md:p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className="text-3xl md:text-5xl mb-2 md:mb-4">🏪</div>
                  <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 group-hover:text-rose-600 transition-colors">My Vendor Profile</h3>
                  <p className="text-gray-600 text-xs md:text-base">Manage your business profile and packages</p>
                </Link>
              )}

              <Link href="/vendors-category" className="group bg-white rounded-2xl p-4 md:p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="text-3xl md:text-5xl mb-2 md:mb-4">🎊</div>
                <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 group-hover:text-rose-600 transition-colors">Vendor Categories</h3>
                <p className="text-gray-600 text-xs md:text-base">Browse vendors by category</p>
              </Link>

              <Link href="/messages" className="group bg-white rounded-2xl p-4 md:p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="text-3xl md:text-5xl mb-2 md:mb-4">💬</div>
                <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 group-hover:text-rose-600 transition-colors">Messages</h3>
                <p className="text-gray-600 text-xs md:text-base">Chat with vendors and planners</p>
              </Link>

              <Link href="/guests" className="group bg-white rounded-2xl p-4 md:p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="text-3xl md:text-5xl mb-2 md:mb-4">👥</div>
                <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 group-hover:text-rose-600 transition-colors">Guest List</h3>
                <p className="text-gray-600 text-xs md:text-base">Manage RSVPs and guest details</p>
              </Link>

              <Link href="/budget" className="group bg-white rounded-2xl p-4 md:p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="text-3xl md:text-5xl mb-2 md:mb-4">💰</div>
                <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 group-hover:text-rose-600 transition-colors">Budget Tracker</h3>
                <p className="text-gray-600 text-xs md:text-base">Track expenses and payments</p>
              </Link>

              <Link href="/tasks" className="group bg-white rounded-2xl p-4 md:p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="text-3xl md:text-5xl mb-2 md:mb-4">✓</div>
                <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 group-hover:text-rose-600 transition-colors">Task Checklist</h3>
                <p className="text-gray-600 text-xs md:text-base">Stay organized with to-do lists</p>
              </Link>

              <Link href="/vendors" className="group bg-white rounded-2xl p-4 md:p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="text-3xl md:text-5xl mb-2 md:mb-4">📋</div>
                <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 group-hover:text-rose-600 transition-colors">My Vendors</h3>
                <p className="text-gray-600 text-xs md:text-base">Your personal vendor contacts</p>
              </Link>
            </>
          ) : (
            <>
              {/* Preview cards for non-logged in users */}
              <div className="bg-white rounded-2xl p-8 shadow-lg relative">
                <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                  Login Required
                </div>
                <div className="text-3xl md:text-5xl mb-2 md:mb-4 opacity-50">📊</div>
                <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 text-gray-800">Dashboard</h3>
                <p className="text-gray-600 text-xs md:text-base">View statistics and countdown</p>
              </div>

              <Link href="/marketplace" className="group bg-white rounded-2xl p-4 md:p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border-2 border-green-200 relative">
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Public
                </div>
                <div className="text-3xl md:text-5xl mb-2 md:mb-4">🎊</div>
                <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 group-hover:text-rose-600 transition-colors">Browse Vendors</h3>
                <p className="text-gray-600 text-xs md:text-base">Explore our vendor marketplace</p>
              </Link>

              <div className="bg-white rounded-2xl p-8 shadow-lg relative">
                <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                  Login Required
                </div>
                <div className="text-3xl md:text-5xl mb-2 md:mb-4 opacity-50">💬</div>
                <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 text-gray-800">Messages</h3>
                <p className="text-gray-600 text-xs md:text-base">Chat with vendors and planners</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg relative">
                <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                  Login Required
                </div>
                <div className="text-3xl md:text-5xl mb-2 md:mb-4 opacity-50">👥</div>
                <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 text-gray-800">Guest List</h3>
                <p className="text-gray-600 text-xs md:text-base">Manage RSVPs and guest details</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg relative">
                <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                  Login Required
                </div>
                <div className="text-3xl md:text-5xl mb-2 md:mb-4 opacity-50">💰</div>
                <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 text-gray-800">Budget Tracker</h3>
                <p className="text-gray-600 text-xs md:text-base">Track expenses and payments</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg relative">
                <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                  Login Required
                </div>
                <div className="text-3xl md:text-5xl mb-2 md:mb-4 opacity-50">✓</div>
                <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 text-gray-800">Task Checklist</h3>
                <p className="text-gray-600 text-xs md:text-base">Stay organized with to-do lists</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg relative">
                <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                  Login Required
                </div>
                <div className="text-3xl md:text-5xl mb-2 md:mb-4 opacity-50">📋</div>
                <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 text-gray-800">My Vendors</h3>
                <p className="text-gray-600 text-xs md:text-base">Your personal vendor contacts</p>
              </div>

              <Link href="/register" className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-4 md:p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 text-white text-center flex flex-col items-center justify-center">
                <div className="text-3xl md:text-5xl mb-2 md:mb-4">🎉</div>
                <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2">Get Started Free!</h3>
                <p className="opacity-90">Sign up to access all features</p>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">How Tegabu Works</h2>
        <p className="text-center text-gray-600 mb-12 text-lg">Getting started is easy!</p>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-gradient-to-br from-rose-400 to-pink-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg">
              1
            </div>
            <h4 className="font-bold text-xl mb-2 text-gray-800">Sign Up</h4>
            <p className="text-gray-600 text-xs md:text-base">Create your account for free</p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-rose-400 to-pink-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg">
              2
            </div>
            <h4 className="font-bold text-xl mb-2 text-gray-800">Plan</h4>
            <p className="text-gray-600 text-xs md:text-base">Add your guest list and budget</p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-rose-400 to-pink-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg">
              3
            </div>
            <h4 className="font-bold text-xl mb-2 text-gray-800">Find Vendors</h4>
            <p className="text-gray-600 text-xs md:text-base">Browse and book the best vendors</p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-rose-400 to-pink-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg">
              4
            </div>
            <h4 className="font-bold text-xl mb-2 text-gray-800">Celebrate!</h4>
            <p className="text-gray-600 text-xs md:text-base">Enjoy your perfect wedding day</p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-3xl p-16 text-center text-white shadow-2xl">
          <div className="text-5xl mb-6">💕</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Plan Your Big Day?</h2>
          <p className="text-xl md:text-2xl mb-10 opacity-95">
            Start planning the wedding you've always dreamed of with Tegabu
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/marketplace"
              className="inline-block bg-white text-rose-600 px-12 py-5 rounded-full text-xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
            >
              Explore Vendors Now
            </Link>
            <button
              onClick={() => setShowQR(true)}
              className="inline-block bg-white/20 backdrop-blur text-white border-2 border-white px-8 py-5 rounded-full text-xl font-bold hover:bg-white/30 transition-all"
            >
              📱 Share QR Code
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Display */}
      {showQR && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowQR(false)}
        >
          <div 
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Share Tegabu</h3>
              <button
                onClick={() => setShowQR(false)}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600 mb-6 text-center">
              Scan with your phone camera
            </p>
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-rose-200">
                <QRCodeSVG 
                  value={typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}
                  size={180}
                  level="H"
                  includeMargin={true}
                  fgColor="#e11d48"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center">
              {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">💐</span>
                <span className="text-2xl font-bold">Tegabu</span>
              </div>
              <p className="text-gray-400">
                Making wedding planning simple and beautiful
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Planning Tools</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/guests" className="hover:text-white transition-colors">Guest List</Link></li>
                <li><Link href="/budget" className="hover:text-white transition-colors">Budget Tracker</Link></li>
                <li><Link href="/tasks" className="hover:text-white transition-colors">Task Checklist</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Find Vendors</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/marketplace" className="hover:text-white transition-colors">All Vendors</Link></li>
                <li><Link href="/vendors-category" className="hover:text-white transition-colors">By Category</Link></li>
                <li><Link href="/vendor-profile" className="hover:text-white transition-colors">Vendor Sign Up</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/messages" className="hover:text-white transition-colors">Messages</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Tegabu. Making your wedding dreams come true.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
