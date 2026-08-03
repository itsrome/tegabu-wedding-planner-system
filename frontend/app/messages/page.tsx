'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tegabu-wedding-planner-system.onrender.com/api';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Message {
  id: number;
  sender_id: number;
  message: string;
  created_at: string;
  sender: User;
}

interface Conversation {
  id: number;
  other_user: User;
  last_message: Message | null;
  last_message_at: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [selectedNewChatUser, setSelectedNewChatUser] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.log('No auth token found, redirecting to login');
      router.push('/login');
      return;
    }

    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      console.log('Current user:', parsedUser);
      setCurrentUser(parsedUser);
    }

    console.log('Loading conversations and users...');
    loadConversations();
    loadUsers();
    setLoading(false);
  }, [router]);

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      
      const response = await fetch(\\\$\{API_URL\}/conversations', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.status === 401 || response.status === 500) {
        console.error('Auth error - clearing token and redirecting');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }
      
      if (!response.ok) {
        console.error('Failed to load conversations - Status:', response.status);
        return;
      }
      
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      // Clear invalid token
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      
      const response = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.status === 401 || response.status === 500) {
        console.error('Auth error - clearing token and redirecting');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }
      
      if (!response.ok) {
        console.error('Failed to load users - Status:', response.status);
        return;
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  const loadMessages = async (conversationId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/conversations/${conversationId}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setMessages(data);
      setSelectedConversation(conversationId);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async (recipientId?: number) => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient_id: recipientId || conversations.find(c => c.id === selectedConversation)?.other_user.id,
          message: newMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Message sent:', data);
        setNewMessage('');
        setShowNewChat(false);
        await loadConversations();
        
        // Find the conversation with this recipient and select it
        if (recipientId) {
          const convs = await fetch(`${API_URL}/conversations`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }).then(r => r.json());
          
          const newConv = convs.find((c: Conversation) => c.other_user.id === recipientId);
          if (newConv) {
            loadMessages(newConv.id);
          }
        } else if (selectedConversation) {
          loadMessages(selectedConversation);
        }
      } else {
        console.error('Failed to send message - Status:', response.status);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      wedding_planner: 'bg-purple-100 text-purple-800',
      client: 'bg-blue-100 text-blue-800',
      vendor: 'bg-green-100 text-green-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">💐</span>
              <span className="text-2xl font-serif bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent" style={{ letterSpacing: '0.05em' }}>Tegabu</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {currentUser?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="w-1/3 bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Messages</h2>
              <button
                onClick={() => setShowNewChat(!showNewChat)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
              >
                + New Chat
              </button>
            </div>

            {showNewChat && (
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold mb-2">Start New Conversation</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {users.length === 0 ? (
                    <p className="text-gray-500 text-sm">No users available</p>
                  ) : (
                    users.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => {
                          setSelectedNewChatUser(user.id);
                          setSelectedConversation(null);
                          setMessages([]);
                        }}
                        className={`p-2 rounded cursor-pointer ${
                          selectedNewChatUser === user.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${getRoleBadge(user.role)}`}>
                            {user.role.replace('_', ' ')}
                          </span>
                          {user.email}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p>No conversations yet</p>
                  <p className="text-sm mt-1">Click "+ New Chat" to start messaging</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      loadMessages(conv.id);
                      setShowNewChat(false);
                      setSelectedNewChatUser(null);
                    }}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedConversation === conv.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-semibold">{conv.other_user.name}</div>
                      <span className={`px-2 py-0.5 rounded text-xs ${getRoleBadge(conv.other_user.role)}`}>
                        {conv.other_user.role.replace('_', ' ')}
                      </span>
                    </div>
                    {conv.last_message && (
                      <div className="text-sm text-gray-600 truncate">
                        {conv.last_message.message}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 bg-white rounded-lg shadow flex flex-col">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold">
                    {conversations.find(c => c.id === selectedConversation)?.other_user.name}
                  </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.sender_id === currentUser?.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <div className="text-sm">{msg.message}</div>
                        <div className={`text-xs mt-1 ${
                          msg.sender_id === currentUser?.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => sendMessage()}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : selectedNewChatUser ? (
              <>
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold">
                    New conversation with {users.find(u => u.id === selectedNewChatUser)?.name}
                  </h2>
                </div>

                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p className="mb-2">Start a new conversation</p>
                    <p className="text-sm">Type your message below to begin</p>
                  </div>
                </div>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage(selectedNewChatUser)}
                      placeholder="Type your first message..."
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => sendMessage(selectedNewChatUser)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
