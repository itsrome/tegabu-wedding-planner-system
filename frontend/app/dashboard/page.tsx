'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tegabu-wedding-planner-system.onrender.com/api';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ guests: 0, bookings: 0, tasks: 0, messages: 0 });
  const [bookings, setBookings] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [daysUntil, setDaysUntil] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) { router.push('/login'); return; }
    const user = localStorage.getItem('user');
    if (user) {
      const u = JSON.parse(user);
      setUserName(u.name);
      if (u.wedding_date) {
        setWeddingDate(u.wedding_date);
        const diff = Math.ceil((new Date(u.wedding_date).getTime() - Date.now()) / 86400000);
        setDaysUntil(diff);
      }
    }
    loadAll(token);
  }, []);

  const loadAll = async (token: string) => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      const [bookingsRes, tasksRes, convsRes, guestsRes] = await Promise.all([
        fetch(`${API_URL}/bookings`, { headers }),
        fetch(`${API_URL}/tasks`, { headers }),
        fetch(`${API_URL}/conversations`, { headers }),
        fetch(`${API_URL}/guests`, { headers }),
      ]);

      if (bookingsRes.status === 401) { router.push('/login'); return; }

      const bookingsData = bookingsRes.ok ? await bookingsRes.json() : [];
      const tasksData = tasksRes.ok ? await tasksRes.json() : [];
      const convsData = convsRes.ok ? await convsRes.json() : [];
      const guestsData = guestsRes.ok ? await guestsRes.json() : [];

      setBookings(Array.isArray(bookingsData) ? bookingsData.slice(0, 5) : []);
      setTasks(Array.isArray(tasksData) ? tasksData.slice(0, 5) : []);
      setConversations(Array.isArray(convsData) ? convsData.slice(0, 5) : []);
      setStats({
        guests: Array.isArray(guestsData) ? guestsData.length : 0,
        bookings: Array.isArray(bookingsData) ? bookingsData.length : 0,
        tasks: Array.isArray(tasksData) ? tasksData.length : 0,
        messages: Array.isArray(convsData) ? convsData.length : 0,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">💐</span>
            <span className="text-2xl font-serif bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">Tegabu</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">👋 {userName}</span>
            <button onClick={() => { localStorage.clear(); router.push('/login'); }} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Logout</button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Dashboard</h1>

        {/* Countdown */}
        {daysUntil !== null && (
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-6 text-white text-center mb-8">
            <div className="text-5xl font-bold">{daysUntil > 0 ? daysUntil : '🎉'}</div>
            <div className="text-xl mt-1">{daysUntil > 0 ? 'days until your wedding' : 'Today is your wedding day!'}</div>
            {weddingDate && <div className="text-sm opacity-80 mt-1">{new Date(weddingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Guests', value: stats.guests, icon: '👥', href: '/guests', color: 'rose' },
            { label: 'Bookings', value: stats.bookings, icon: '📋', href: '/bookings', color: 'blue' },
            { label: 'Tasks', value: stats.tasks, icon: '✅', href: '/tasks', color: 'green' },
            { label: 'Chats', value: stats.messages, icon: '💬', href: '/messages', color: 'purple' },
          ].map(s => (
            <Link key={s.label} href={s.href} className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition-all text-center">
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="text-3xl font-bold text-gray-800">{s.value}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">📋 Recent Bookings</h2>
              <Link href="/bookings" className="text-rose-500 text-sm hover:underline">View all</Link>
            </div>
            {bookings.length === 0 ? (
              <p className="text-gray-500 text-sm">No bookings yet. <Link href="/vendors-category" className="text-rose-500 hover:underline">Browse vendors →</Link></p>
            ) : (
              <div className="space-y-3">
                {bookings.map((b: any) => (
                  <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{b.vendor_profile?.business_name || 'Vendor'}</div>
                      <div className="text-xs text-gray-500">{b.event_date ? new Date(b.event_date).toLocaleDateString() : 'No date'}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>{b.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Messages */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">💬 Recent Messages</h2>
              <Link href="/messages" className="text-rose-500 text-sm hover:underline">View all</Link>
            </div>
            {conversations.length === 0 ? (
              <p className="text-gray-500 text-sm">No messages yet. <Link href="/messages" className="text-rose-500 hover:underline">Start a chat →</Link></p>
            ) : (
              <div className="space-y-3">
                {conversations.map((c: any) => (
                  <Link key={c.id} href="/messages" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <div className="w-9 h-9 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-sm">
                      {c.other_user?.name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{c.other_user?.name || 'User'}</div>
                      <div className="text-xs text-gray-500 truncate">{c.last_message?.message || 'No messages yet'}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Tasks */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">✅ Recent Tasks</h2>
              <Link href="/tasks" className="text-rose-500 text-sm hover:underline">View all</Link>
            </div>
            {tasks.length === 0 ? (
              <p className="text-gray-500 text-sm">No tasks yet. <Link href="/tasks" className="text-rose-500 hover:underline">Add a task →</Link></p>
            ) : (
              <div className="space-y-3">
                {tasks.map((t: any) => (
                  <div key={t.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      t.status === 'completed' ? 'bg-green-500' :
                      t.status === 'in_progress' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}></span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{t.title}</div>
                      <div className="text-xs text-gray-500">{t.status?.replace('_', ' ')}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { href: '/vendors-category', icon: '🛍️', label: 'Find Vendors' },
              { href: '/guests', icon: '👥', label: 'Manage Guests' },
              { href: '/budget', icon: '💰', label: 'Budget' },
              { href: '/inspiration', icon: '✨', label: 'Inspiration' },
            ].map(a => (
              <Link key={a.href} href={a.href} className="flex flex-col items-center gap-2 p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors">
                <span className="text-2xl">{a.icon}</span>
                <span className="text-sm font-medium text-gray-700">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
