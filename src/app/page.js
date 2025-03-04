'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// This is the main entry page
export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // If authenticated, redirect to dashboard
    // If not authenticated, redirect to login
    if (!loading) {
      if (isAuthenticated) {
        // In a real app, you would use Next.js router to redirect
        console.log('Redirect to dashboard');
      } else {
        // In a real app, you would use Next.js router to redirect
        console.log('Redirect to login');
      }
    }
  }, [isAuthenticated, loading]);

  // Show loading spinner while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner fullScreen text="Loading application..." />
      <h1 className="text-2xl font-bold">Temple Management System</h1>
    </div>
  );
}