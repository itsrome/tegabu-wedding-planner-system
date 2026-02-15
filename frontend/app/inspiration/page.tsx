'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';

interface InspirationImage {
  id: number;
  image_path: string;
  title: string | null;
  description: string | null;
  created_at: string;
}

export default function InspirationBoard() {
  const [images, setImages] = useState<InspirationImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const token = localStorage.getItem('auth_token');
    const res = await fetch('http://localhost:8000/api/inspiration', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setImages(data);
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    setUploading(true);
    setError('');
    setSuccess('');
    const token = localStorage.getItem('auth_token');
    
    try {
      const res = await fetch('http://localhost:8000/api/inspiration', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        (e.target as HTMLFormElement).reset();
        setSuccess('✅ Image uploaded successfully!');
        fetchImages();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to upload image. Please try again.');
      }
    } catch (err) {
      setError('Upload failed. Check your connection.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this image?')) return;
    
    const token = localStorage.getItem('auth_token');
    await fetch(`http://localhost:8000/api/inspiration/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchImages();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Inspiration Board
          </h1>
          <p className="text-gray-600 text-lg">Collect and organize your wedding inspiration</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl mb-12 border border-purple-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-3xl">✨</span> Upload New Inspiration
          </h2>
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4">
              {success}
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                required
                className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Title (optional)</label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Floral centerpiece idea"
                className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Description (optional)</label>
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add notes about this inspiration..."
                className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                rows={3}
              />
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {uploading ? '⏳ Uploading...' : '📤 Upload Inspiration'}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((img) => (
            <div key={img.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative overflow-hidden">
                <img
                  src={`http://localhost:8000/storage/${img.image_path}`}
                  alt={img.title || 'Inspiration'}
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                {img.title && (
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">{img.title}</h3>
                )}
                {img.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{img.description}</p>
                )}
                <button
                  onClick={() => handleDelete(img.id)}
                  className="text-red-500 text-sm font-semibold hover:text-red-700 hover:underline transition-colors flex items-center gap-1"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">💐</div>
            <p className="text-gray-500 text-xl font-medium">No inspiration images yet</p>
            <p className="text-gray-400 mt-2">Upload your first one to start building your dream wedding!</p>
          </div>
        )}
      </div>
    </div>
  );
}
