import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { useProgress } from '../contexts/ProgressContext';
import { WifiOff } from 'lucide-react';

export const Layout: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { isLoading } = useProgress();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-inter">
      <Navigation />
      
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 relative">
        {!isOnline && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center justify-center gap-2 text-yellow-800 text-sm">
            <WifiOff className="w-4 h-4" />
            <span>You're offline. Previously downloaded lessons remain available.</span>
          </div>
        )}
        <div className="max-w-4xl mx-auto min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
