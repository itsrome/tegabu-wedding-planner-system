'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tegabu-wedding-planner-system.onrender.com/api';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AuthCheck from '@/components/AuthCheck';

interface Stats {
  guests: {
    total: number;
    confirmed: number;
    pending: number;
    declined: number;
  };
  budget: {
    estimated: number;
    actual: number;
    remaining: number;
    paid: number;
  };
  tasks: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
  };
  bookings: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    guests: { total: 0, confirmed: 0, pending: 0, declined: 0 },
    budget: { estimated: 0, actual: 0, remaining: 0, paid: 0 },
    tasks: { total: 0, pending: 0, in_progress: 0, completed: 0 },
    bookings: 0,
  });
  const [weddingDate, setWeddingDate] = useState<string>('');
  const [daysUntil, setDaysUntil] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const user = localStorage.getItem('user');
      
      if (user) {
        const userData = JSON.parse(user);
        setUserName(userData.name);
        if (userData.wedding_date) {
          setWeddingDate(userData.wedding_date);
          calculateDaysUntil(userData.wedding_date);
        }
      }

      // Load guests
      try {
        const guestsRes = await fetch('${API_URL}/guests', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (guestsRes.status === 401 || guestsRes.status === 500) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }
        if (guestsRes.ok) {
          const guests = await guestsRes.json();
          setStats(prev => ({
            ...prev,
            guests: {
              total: guests.length,
              confirmed: guests.filter((g: any) => g.rsvp_status === 'confirmed').length,
              pending: guests.filter((g: any) => g.rsvp_status === 'pending').length,
              declined: guests.filter((g: any) => g.rsvp_status === 'declined').length,
            }
          }));
        }
      } catch (err) {
        console.error('Failed to load guests:', err);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }
      
      // Load budget
      try {
        const budgetRes = await fetch('${API_URL}/budget/summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (budgetRes.ok) {
          const budget = await budgetRes.json();
          setStats(prev => ({
            ...prev,
            budget: {
              estimated: budget.total_estimated || 0,
              actual: budget.total_actual || 0,
              remaining: budget.remaining || 0,
              paid: budget.total_paid || 0,
            }
          }));
        }
      } catch (err) {
        console.error('Failed to load budget:', err);
      }
      
      // Load tasks
      try {
        const tasksRes = await fetch('${API_URL}/tasks', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (tasksRes.ok) {
          const tasks = await tasksRes.json();
          setStats(prev => ({
            ...prev,
            tasks: {
              total: tasks.length,
              pending: tasks.filter((t: any) => t.status === 'pending').length,
              in_progress: tasks.filter((t: any) => t.status === 'in_progress').length,
              completed: tasks.filter((t: any) => t.status === 'completed').length,
            }
          }));
        }
      } catch (err) {
        console.error('Failed to load tasks:', err);
      }

      // Load bookings
      try {
        const bookingsRes = await fetch('${API_URL}/bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (bookingsRes.ok) {
          const bookings = await bookingsRes.json();
          setStats(prev => ({
            ...prev,
            bookings: Array.isArray(bookings) ? bookings.length : 0
          }));
        }
      } catch (err) {
        console.error('Failed to load bookings:', err);
      }

    } catch (error) {
      console.error('Failed to load dashboard:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysUntil = (date: string) => {
    const wedding = new Date(date);
    const today = new Date();
    const diff = wedding.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    setDaysUntil(days);
  };

  if (loading) {
    return (
      <AuthCheck>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">💐</div>
            <div className="text-xl text-gray-600">Loading your dashboard...</div>
          </div>
        </div>
      </AuthCheck>
    );
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="text-rose-600 hover:text-rose-700 mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Wedding Dashboard
            </h1>
            <p className="text-gray-600">Your wedding planning at a glance</p>
          </div>

          {/* Wedding Countdown */}
          {weddingDate && daysUntil !== null && (
            <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-3xl p-8 text-white text-center mb-8 shadow-2xl">
              <div className="text-5xl mb-4">💍✨</div>
              <h2 className="text-3xl font-bold mb-2">
                {daysUntil > 0 ? `${daysUntil} Days Until Your Big Day!` : 
                 daysUntil === 0 ? 'Today is Your Wedding Day! 🎉' :
                 'Congratulations on Your Marriage! 💕'}
              </h2>
              <p className="text-xl opacity-90">
                {new Date(weddingDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Guests Card */}
            <Link href="/guests" className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">👥</div>
                <div className="text-3xl font-bold text-rose-600">{stats.guests.total}</div>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Guests</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Confirmed:</span>
                  <span className="font-semibold text-green-600">{stats.guests.confirmed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending:</span>
                  <span className="font-semibold text-yellow-600">{stats.guests.pending}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Declined:</span>
                  <span className="font-semibold text-red-600">{stats.guests.declined}</span>
                </div>
              </div>
            </Link>

            {/* Budget Card */}
            <Link href="/budget" className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">💰</div>
                <div className="text-3xl font-bold text-rose-600">
                  ${stats.budget.estimated.toLocaleString()}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Budget</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Spent:</span>
                  <span className="font-semibold text-blue-600">${stats.budget.actual.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining:</span>
                  <span className="font-semibold text-green-600">${stats.budget.remaining.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid:</span>
                  <span className="font-semibold text-purple-600">${stats.budget.paid.toLocaleString()}</span>
                </div>
              </div>
            </Link>

            {/* Tasks Card */}
            <Link href="/tasks" className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">✓</div>
                <div className="text-3xl font-bold text-rose-600">{stats.tasks.total}</div>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Tasks</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-semibold text-green-600">{stats.tasks.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">In Progress:</span>
                  <span className="font-semibold text-blue-600">{stats.tasks.in_progress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending:</span>
                  <span className="font-semibold text-yellow-600">{stats.tasks.pending}</span>
                </div>
              </div>
            </Link>

            {/* Bookings Card */}
            <Link href="/marketplace" className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">📋</div>
                <div className="text-3xl font-bold text-rose-600">{stats.bookings}</div>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Vendor Bookings</h3>
              <p className="text-sm text-gray-600">
                You have {stats.bookings} vendor {stats.bookings === 1 ? 'booking' : 'bookings'}
              </p>
              <div className="mt-4">
                <span className="text-xs text-rose-600 font-semibold">View All →</span>
              </div>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/guests"
                className="flex items-center gap-3 p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
              >
                <span className="text-3xl">👥</span>
                <div>
                  <div className="font-semibold text-gray-800">Add Guest</div>
                  <div className="text-sm text-gray-600">Manage your guest list</div>
                </div>
              </Link>

              <Link
                href="/tasks"
                className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors"
              >
                <span className="text-3xl">✓</span>
                <div>
                  <div className="font-semibold text-gray-800">Add Task</div>
                  <div className="text-sm text-gray-600">Stay organized</div>
                </div>
              </Link>

              <Link
                href="/marketplace"
                className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
              >
                <span className="text-3xl">🎊</span>
                <div>
                  <div className="font-semibold text-gray-800">Find Vendors</div>
                  <div className="text-sm text-gray-600">Browse marketplace</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}
