'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AuthCheck from '@/components/AuthCheck';

export default function PlannerDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      if (userData.role !== 'wedding_planner') {
        alert('Access denied. Wedding Planners only.');
        router.push('/dashboard');
        return;
      }
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <AuthCheck>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">💼</div>
            <div className="text-xl text-gray-600">Loading planner dashboard...</div>
          </div>
        </div>
      </AuthCheck>
    );
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              💼 Wedding Planner Dashboard
            </h1>
            <p className="text-gray-600">Professional wedding planning tools</p>
          </div>

          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white mb-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-6xl">💼</div>
              <div>
                <h2 className="text-3xl font-bold">Welcome, {currentUser?.name}!</h2>
                <p className="text-lg opacity-90">Professional Wedding Planner</p>
              </div>
            </div>
            <p className="text-lg">
              You have access to all planning tools to help your clients create their perfect wedding day.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link
              href="/dashboard"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Client Dashboard</h3>
              <p className="text-gray-600">View wedding statistics and countdown</p>
            </Link>

            <Link
              href="/guests"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-2">Guest Management</h3>
              <p className="text-gray-600">Manage guest lists and RSVPs</p>
            </Link>

            <Link
              href="/budget"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Budget Tracking</h3>
              <p className="text-gray-600">Track expenses and payments</p>
            </Link>

            <Link
              href="/tasks"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">✓</div>
              <h3 className="text-xl font-bold mb-2">Task Checklist</h3>
              <p className="text-gray-600">Organize planning tasks</p>
            </Link>

            <Link
              href="/marketplace"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">🎊</div>
              <h3 className="text-xl font-bold mb-2">Vendor Marketplace</h3>
              <p className="text-gray-600">Browse and book vendors</p>
            </Link>

            <Link
              href="/bookings"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-bold mb-2">Vendor Bookings</h3>
              <p className="text-gray-600">Manage vendor bookings</p>
            </Link>

            <Link
              href="/messages"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">Messages</h3>
              <p className="text-gray-600">Communicate with vendors</p>
            </Link>

            <Link
              href="/vendors"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">📞</div>
              <h3 className="text-xl font-bold mb-2">Vendor Contacts</h3>
              <p className="text-gray-600">Save vendor information</p>
            </Link>

            <Link
              href="/profile"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold mb-2">Profile Settings</h3>
              <p className="text-gray-600">Manage account settings</p>
            </Link>
          </div>

          {/* Professional Tools Info */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">💼 Professional Wedding Planner Tools</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-purple-600">✅ Available Features:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Complete wedding planning dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Guest list management with RSVP tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Budget tracking and expense management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Task checklist with priorities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Access to 45+ verified vendors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Vendor booking and management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Direct messaging with vendors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Export guest lists to CSV</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 text-pink-600">🔮 Future Enhancements:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">○</span>
                    <span>Manage multiple client weddings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">○</span>
                    <span>Client portfolio and testimonials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">○</span>
                    <span>Vendor commission tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">○</span>
                    <span>Timeline and schedule builder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">○</span>
                    <span>Contract management system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">○</span>
                    <span>Client communication portal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">○</span>
                    <span>Analytics and reporting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">○</span>
                    <span>Professional invoicing</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Note:</strong> As a professional wedding planner, you have access to all client features 
                to help plan and coordinate weddings. You can manage guest lists, track budgets, coordinate with 
                vendors, and ensure every detail is perfect for your clients' special day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}
