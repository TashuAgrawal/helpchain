"use client";

import Image from "next/image";
import { useAuth } from '@/app/components/AuthContext'; 
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth'; 
import { AuthContextType } from '@/app/types/auth';

const isFirebaseUser = (user: any): user is User => {
  return user && typeof user.email === 'string' && typeof user.uid === 'string';
};

// Role type definition
type UserRole = 'user' | 'admin' | 'ngo';

export default function Home() {
  const { currentUser, loading, signOut } = useAuth() as AuthContextType;
  const router = useRouter();
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Function to get user role from localStorage
 const getUserRole = (): UserRole | null => {
  if (typeof window !== 'undefined') {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        console.log('Parsed user:', user);

        console.log(user.user.role);
        
        
        if (user.user.role && (user.user.role === 'user' || user.user.role === 'admin' )) {
          return user.user.role as UserRole;
        }
        return "ngo" as UserRole;
      }
    } catch (error) {
      console.error('Error reading/parsing user from localStorage:', error);
    }
  }
  return null;
};

  // Conditional routing function
  const handleDashboardRedirect = () => {
    const role = getUserRole();

    console.log(role);
    
    
    if (role === 'user') {
      router.push('/users/dashboard');
    } else if (role === 'admin') {
      router.push('/admin/dashboard');
    } else if (role === 'ngo') {
      router.push('/ngo/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  // Load role on mount (for logged-in view)
  useEffect(() => {
    if (currentUser && isFirebaseUser(currentUser)) {
      const role = getUserRole();
      setUserRole(role);
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold text-gray-400 bg-gray-900">
        Checking session...
      </div>
    );
  }

  // --- Logged In Dashboard ---
  if (currentUser && isFirebaseUser(currentUser)) {
    return (
      <div className="font-sans min-h-screen p-8 pb-20 sm:p-20 flex flex-col items-center justify-center text-center bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900">
        <main className="flex flex-col gap-8 items-center w-full max-w-2xl p-10 bg-gray-800/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-gray-700/50">
          <div className="w-24 h-24 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30">
            <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome back, {currentUser.email!.split('@')[0]}!
          </h1>
          
          <div className="flex flex-col items-center gap-2 mb-8">
            <p className="text-xl text-gray-300 max-w-md">
              HelpChain Dashboard - Ready to make an impact.
            </p>
            {userRole && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium border border-indigo-500/30">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                Role: <span className="font-bold capitalize">{userRole}</span>
              </div>
            )}
          </div>

          <div className="w-full max-w-md space-y-4">
            <button
              onClick={handleDashboardRedirect}
              className="group relative w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold text-lg rounded-2xl shadow-2xl shadow-indigo-500/25 hover:shadow-3xl hover:shadow-purple-500/40 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden backdrop-blur-sm"
            >
              <span className="relative z-10">Go to {userRole ? `${userRole} Dashboard` : 'Dashboard'}</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent -skew-x-12 -translate-x-20 group-hover:translate-x-20 transition-transform duration-700"></div>
            </button>
            
            <button
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 border-2 border-red-500/50 bg-red-500/10 text-red-400 font-semibold rounded-xl hover:bg-red-500/20 hover:border-red-400 hover:text-red-300 backdrop-blur-sm transition-all duration-300"
            >
              Sign Out
            </button>
          </div>
        </main>
      </div>
    );
  }

  // --- Public Landing Page (Dark Mode) ---
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 overflow-hidden">
      {/* Animated Background - Dark Mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-indigo-400/30 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400/30 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-pink-400/30 rounded-full animate-pulse animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-indigo-400/30 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative pt-16 pb-32 px-6 sm:px-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-24">
          <div className="inline-flex items-center gap-3 bg-indigo-500/10 px-6 py-3 rounded-full mb-8 backdrop-blur-sm border border-indigo-500/20">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-indigo-300">NGO Partnership Platform</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent leading-tight mb-8 drop-shadow-2xl">
            HelpChain
            <span className="block text-3xl sm:text-4xl font-light text-gray-300 mt-4">Transparent NGO Donations</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed drop-shadow-lg">
            Connect donors with verified NGOs. Track every rupee. Build trust through transparency.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <button
              onClick={() => router.push('/signup')}
              className="group relative w-full sm:w-auto flex items-center justify-center gap-3 py-6 px-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-lg rounded-3xl shadow-2xl shadow-indigo-500/25 hover:shadow-3xl hover:shadow-purple-500/40 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transform hover:-translate-y-2 transition-all duration-500 overflow-hidden backdrop-blur-sm"
            >
              <span className="relative z-10 tracking-wide">Start Donating Today</span>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent -skew-x-12 -translate-x-20 group-hover:translate-x-20 transition-transform duration-1000"></div>
            </button>
            
            <button
              onClick={() => router.push('/about')}
              className="group w-full sm:w-auto flex items-center justify-center gap-2 py-6 px-8 border-2 border-gray-600/50 bg-gray-800/50 text-gray-200 font-semibold text-lg rounded-3xl hover:bg-gray-700/70 hover:border-gray-400/70 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              Learn More
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-8 mb-24">
          <div className="group p-8 rounded-3xl bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-4 hover:bg-gray-700/80 transition-all duration-500">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center group-hover:bg-indigo-500/30 group-hover:border-indigo-400/50 mb-6 transition-all duration-300 border border-indigo-500/30">
              <svg className="w-8 h-8 text-indigo-400 group-hover:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">Verified NGOs</h3>
            <p className="text-gray-300 leading-relaxed group-hover:text-gray-200">Partner with trusted organizations. Every NGO undergoes rigorous verification.</p>
          </div>

          <div className="group p-8 rounded-3xl bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-4 hover:bg-gray-700/80 transition-all duration-500">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500/30 group-hover:border-emerald-400/50 mb-6 transition-all duration-300 border border-emerald-500/30">
              <svg className="w-8 h-8 text-emerald-400 group-hover:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">Real-time Tracking</h3>
            <p className="text-gray-300 leading-relaxed group-hover:text-gray-200">See exactly where your donations go. Full transparency from donation to impact.</p>
          </div>

          <div className="group p-8 rounded-3xl bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-4 hover:bg-gray-700/80 transition-all duration-500">
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center group-hover:bg-purple-500/30 group-hover:border-purple-400/50 mb-6 transition-all duration-300 border border-purple-500/30">
              <svg className="w-8 h-8 text-purple-400 group-hover:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">Trusted Platform</h3>
            <p className="text-gray-300 leading-relaxed group-hover:text-gray-200">Secure, reliable, and built for impact. Join thousands making a difference.</p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="max-w-2xl mx-auto text-center p-12 bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/25">
            <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.27 7.27c.396.397.958.73 1.53.73s1.134-.333 1.53-.73L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 drop-shadow-2xl">Get In Touch</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-xl mx-auto drop-shadow-lg">
            NGOs: Send your documents and partnership proposals. Donors: Have questions? We're here to help.
          </p>
          
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-8 rounded-2xl border-2 border-indigo-500/30 backdrop-blur-sm hover:border-indigo-400/50 transition-all duration-300">
            <div className="text-2xl font-mono font-bold text-indigo-300 mb-2 drop-shadow-lg select-all">tashuagrawal67@gmail.com</div>
            <p className="text-sm text-gray-400">📧 Ready to receive your documents, proposals, and partnership inquiries</p>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            Response within 24 hours | All emails are confidential
          </p>
        </section>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(20px, -20px) scale(1.1); }
          66% { transform: translate(-10px, 15px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
