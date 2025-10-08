"use client";

import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AuthContextType, EnrichedUser } from '@/types/auth'; // Importing the correct type definitions
// No longer need to import FirebaseUser here as it's handled in the types file

export default function DashboardPage() {
  // Use the single, correct imported type
  const { currentUser, loading, signOut } = useAuth() as AuthContextType;
  const router = useRouter();

  // Redirect if not logged in after loading finishes
  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/'); // Redirect to home/login page
    }
  }, [currentUser, loading, router]);

  // Display a loading state while authentication status is determined
  if (loading || !currentUser) {
    // If loading, show status. If not loading and no user, we are redirecting.
    return <div className="p-8 text-xl">Checking permissions...</div>;
  }
  
  // NOTE: currentUser is now correctly typed as EnrichedUser due to the assertion
  // and the updated types file.

  // --- Protected Content: Renders ONLY if the user is logged in ---
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-green-700">Protected Dashboard</h1>
      <p className="mt-4 text-lg">
        You are successfully logged in and accessing protected content.
      </p>
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        {/* 'currentUser' is now typed as EnrichedUser, so 'username' is safe */}
        {/* We can safely cast currentUser to EnrichedUser here for clarity, though TS now understands it */}
        <h2 className="text-xl font-semibold">Welcome, {(currentUser as EnrichedUser).username || currentUser.email}!</h2>
        <p className="text-sm text-gray-600">Email: {currentUser.email}</p>
        <p className="text-sm text-gray-600">UID: {currentUser.uid}</p>
      </div>

      <button
        onClick={signOut}
        className="mt-8 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}
