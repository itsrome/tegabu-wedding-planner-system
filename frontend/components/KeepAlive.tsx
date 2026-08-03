'use client';

import { useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tegabu-wedding-planner-system.onrender.com/api';

export default function KeepAlive() {
  useEffect(() => {
    // Ping backend immediately on load
    fetch(`${API_URL}/vendor-profiles`).catch(() => {});

    // Then ping every 4 minutes to prevent Render from sleeping
    const interval = setInterval(() => {
      fetch(`${API_URL}/vendor-profiles`).catch(() => {});
    }, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
