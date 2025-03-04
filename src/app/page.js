'use client';

import { redirect } from 'next/navigation';
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
        redirect('/dashboard');
      } else {
        redirect('/login');
      }
    }
  }, [isAuthenticated, loading]);

  // Show loading spinner while checking authentication
  return <LoadingSpinner fullScreen />;
}