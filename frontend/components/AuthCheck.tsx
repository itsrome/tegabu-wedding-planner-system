'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip auth check for login and register pages
    if (pathname === '/login' || pathname === '/register') {
      setIsAuthenticated(true);
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      // Clear any stale data
      localStorage.clear();
      router.push('/login');
    } else {
      // Verify token is valid by checking user data
      const user = localStorage.getItem('user');
      if (!user) {
        // Token exists but no user data - clear and redirect
        localStorage.clear();
        router.push('/login');
      } else {
        setIsAuthenticated(true);
      }
    }
    
    setLoading(false);
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="text-center">
          <div className="text-5xl mb-4">💐</div>
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
