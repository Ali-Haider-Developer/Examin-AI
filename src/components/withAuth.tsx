'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { protectRoute } from '@/utils/authUtils';

// Loading component
const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

// Higher-order component to protect routes
export default function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProtectedRoute(props: P) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const isAuth = await protectRoute(router);
          setAuthenticated(isAuth);
        } catch (error) {
          console.error('Authentication error:', error);
          setAuthenticated(false);
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    }, [router]);

    if (loading) {
      return <LoadingScreen />;
    }

    return authenticated ? <Component {...props} /> : null;
  };
}
