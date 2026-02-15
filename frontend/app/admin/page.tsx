'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AuthCheck from '@/components/AuthCheck';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface Stats {
  totalUsers: number;
  totalClients: number;
  totalVendors: number;
  totalBookings: number;
  totalVendorProfiles: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalClients: 0,
    totalVendors: 0,
    totalBookings: 0,
    totalVendorProfiles: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is admin
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      if (userData.role !== 'admin') {
        alert('Access denied. Admin only.');
        router.push('/dashboard');
        return;
      }
    }
    
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Load stats
      const statsRes = await fetch('http://localhost:8000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      
      // Load all users
      const usersRes = await fetch('http://localhost:8000/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: number, userName: string) => {
    if (!confirm(`Delete user "${userName}"? This cannot be undone.`)) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`http://localhost:8000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        alert('✅ User deleted successfully');
        loadData();
      } else {
        const error = await res.json();
        alert(`Failed: ${error.message}`);
      }
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      wedding_planner: 'bg-purple-100 text-purple-800',
      client: 'bg-blue-100 text-blue-800',
      vendor: 'bg-green-100 text-green-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <AuthCheck>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">👑</div>
            <div className="text-xl text-gray-600">Loading admin dashboard...</div>
          </div>
        </div>
      </AuthCheck>
    );
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
              👑 Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage users and system settings</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-3xl font-bold text-gray-800">{stats.totalUsers}</div>
              <div className="text-gray-600">Total Users</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-2">💑</div>
              <div className="text-3xl font-bold text-blue-600">{stats.totalClients}</div>
              <div className="text-gray-600">Clients</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-2">🏪</div>
              <div className="text-3xl font-bold text-green-600">{stats.totalVendors}</div>
              <div className="text-gray-600">Vendors</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-2">📋</div>
              <div className="text-3xl font-bold text-orange-600">{stats.totalBookings || 0}</div>
              <div className="text-gray-600">Total Bookings</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/marketplace"
                className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
              >
                <span className="text-3xl">🎊</span>
                <div>
                  <div className="font-semibold text-gray-800">View Marketplace</div>
                  <div className="text-sm text-gray-600">Browse all vendors</div>
                </div>
              </Link>

              <Link
                href="/messages"
                className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <span className="text-3xl">💬</span>
                <div>
                  <div className="font-semibold text-gray-800">Messages</div>
                  <div className="text-sm text-gray-600">View all conversations</div>
                </div>
              </Link>

              <Link
                href="/admin/bookings"
                className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
              >
                <span className="text-3xl">📋</span>
                <div>
                  <div className="font-semibold text-gray-800">Manage Bookings</div>
                  <div className="text-sm text-gray-600">View all bookings</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Users List */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">All Users</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Joined</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{user.id}</td>
                      <td className="py-3 px-4 font-semibold">{user.name}</td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(user.role)}`}>
                          {user.role.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button 
                          onClick={() => deleteUser(user.id, user.name)}
                          className="text-red-600 hover:text-red-800 text-sm font-semibold"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Admin Capabilities Info */}
          <div className="mt-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-2xl font-bold mb-4">👑 Admin Capabilities</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">✅ Current Features:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• View all users and their roles</li>
                  <li>• Monitor system statistics</li>
                  <li>• Access all platform features</li>
                  <li>• View marketplace and vendors</li>
                  <li>• Access messaging system</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🔮 Future Enhancements:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Verify/unverify vendors</li>
                  <li>• Delete users or content</li>
                  <li>• View all bookings system-wide</li>
                  <li>• Generate reports and analytics</li>
                  <li>• Manage platform settings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}
