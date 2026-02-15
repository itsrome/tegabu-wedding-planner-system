'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [userName, setUserName] = useState('User');
  const [userRole, setUserRole] = useState('client');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        setUserName(userData.name || 'User');
        setUserRole(userData.role || 'client');
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setUserName('User');
      setUserRole('client');
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  if (!mounted) {
    return (
      <nav className="bg-white shadow-sm border-b border-rose-100">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💐</span>
            <span className="text-2xl font-serif font-bold tracking-wide bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent" style={{ fontFamily: 'Georgia, serif' }}>
              Tegabu
            </span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-rose-100">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💐</span>
          <span className="text-2xl font-serif font-bold tracking-wide bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent" style={{ fontFamily: 'Georgia, serif' }}>
            Tegabu
          </span>
        </div>
        <div className="flex items-center gap-4">
          {userRole === 'admin' ? (
            <>
              <Link href="/admin" className="text-gray-600 hover:text-rose-600 transition-colors">
                👑 Admin
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-rose-600 transition-colors">
                📊 Dashboard
              </Link>
              <Link href="/bookings" className="text-gray-600 hover:text-rose-600 transition-colors">
                📋 Bookings
              </Link>
            </>
          ) : userRole === 'wedding_planner' ? (
            <>
              <Link href="/planner-dashboard" className="text-gray-600 hover:text-rose-600 transition-colors">
                💼 Planner
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-rose-600 transition-colors">
                📊 Dashboard
              </Link>
              <Link href="/bookings" className="text-gray-600 hover:text-rose-600 transition-colors">
                📋 Bookings
              </Link>
            </>
          ) : userRole === 'vendor' ? (
            <Link href="/vendor-dashboard" className="text-gray-600 hover:text-rose-600 transition-colors">
              📊 Dashboard
            </Link>
          ) : (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-rose-600 transition-colors">
                📊 Dashboard
              </Link>
              <Link href="/inspiration" className="text-gray-600 hover:text-rose-600 transition-colors">
                ✨ Inspiration
              </Link>
              <Link href="/bookings" className="text-gray-600 hover:text-rose-600 transition-colors">
                📋 Bookings
              </Link>
            </>
          )}
          <Link href="/marketplace" className="text-gray-600 hover:text-rose-600 transition-colors">
            🎊 Marketplace
          </Link>
          <Link href="/messages" className="text-gray-600 hover:text-rose-600 transition-colors">
            💬 Messages
          </Link>
          <Link href="/profile" className="text-gray-600 hover:text-rose-600 transition-colors">
            ⚙️ Profile
          </Link>
          <span className="text-gray-600">Welcome, {userName}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
