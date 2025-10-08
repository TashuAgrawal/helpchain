"use client"; // <-- CRITICAL: Makes it a client component

import Image from "next/image";
import { useAuth } from '@/components/AuthContext'; 
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth'; 
import { AuthContextType } from '@/types/auth'; // <-- IMPORT THE NEW TYPE

// Type Guard: Helps TypeScript confirm the user object is valid
const isFirebaseUser = (user: any): user is User => {
  return user && typeof user.email === 'string' && typeof user.uid === 'string';
};

export default function Home() {
  // Use type assertion (as AuthContextType) to fix the 'never' error
  const { currentUser, loading, signOut } = useAuth() as AuthContextType;
  const router = useRouter();

  // --- Display Loading State ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold">
        Checking session...
      </div>
    );
  }

  // --- Logged In View ---
  if (currentUser && isFirebaseUser(currentUser)) {
    return (
      <div className="font-sans min-h-screen p-8 pb-20 sm:p-20 flex flex-col items-center justify-center text-center bg-gray-50">
        <main className="flex flex-col gap-6 items-center w-full max-w-lg p-8 bg-white shadow-xl rounded-lg">
          <h1 className="text-4xl font-bold text-indigo-700">Welcome back, {currentUser.email}!</h1>
          
          <p className="text-lg text-gray-700">
            Your session is active.
          </p>

          <button
            onClick={signOut}
            className="w-full sm:w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Sign Out
          </button>
        </main>
      </div>
    );
  }

  // --- Logged Out View (Your original content) ---
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-gray-900 text-center sm:text-left">
          Welcome to HelpChain .
        </h1>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button
            onClick={() => router.push('/signup')}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-indigo-600 text-white gap-2 hover:bg-indigo-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            Sign Up
          </button>
        </div>
      </main>
      {/* ... (Original Footer content) ... */}
    </div>
  );
}