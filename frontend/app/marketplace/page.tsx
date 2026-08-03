'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MarketplacePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/vendors-category');
  }, []);
  return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
}
