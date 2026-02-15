'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CheckRolePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Check Your Role</h1>
        
        {user ? (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Name</div>
              <div className="font-semibold text-lg">{user.name}</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Email</div>
              <div className="font-semibold text-lg">{user.email}</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Role</div>
              <div className="font-semibold text-2xl">{user.role}</div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">What you should see:</div>
              {user.role === 'admin' && (
                <div className="text-green-600 font-semibold">
                  ✅ You should see "👑 Admin" link in navbar
                </div>
              )}
              {user.role === 'vendor' && (
                <div className="text-green-600 font-semibold">
                  ✅ You should see "📊 Dashboard" (vendor) in navbar
                </div>
              )}
              {user.role === 'client' && (
                <div className="text-green-600 font-semibold">
                  ✅ You should see "📊 Dashboard" and "📋 Bookings" in navbar
                </div>
              )}
            </div>

            <div className="pt-4 space-y-2">
              <Link
                href="/"
                className="block w-full bg-blue-500 text-white text-center py-3 rounded-lg hover:bg-blue-600"
              >
                Go to Homepage
              </Link>
              
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="block w-full bg-red-500 text-white text-center py-3 rounded-lg hover:bg-red-600"
                >
                  👑 Go to Admin Dashboard
                </Link>
              )}
              
              {user.role === 'vendor' && (
                <Link
                  href="/vendor-dashboard"
                  className="block w-full bg-green-500 text-white text-center py-3 rounded-lg hover:bg-green-600"
                >
                  📊 Go to Vendor Dashboard
                </Link>
              )}
              
              {user.role === 'client' && (
                <Link
                  href="/bookings"
                  className="block w-full bg-purple-500 text-white text-center py-3 rounded-lg hover:bg-purple-600"
                >
                  📋 Go to Bookings
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Not logged in</p>
            <Link
              href="/login"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
