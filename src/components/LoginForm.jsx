// src/components/LoginForm.jsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext'; 

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      setIsSubmitting(false);
      return;
    }

    // Flag to control redirection
    let shouldRedirect = false; 

    try {
      // 1. Call the login function from the AuthContext
      const result = await login({ email, password });

      if (result.success) {
        // Login successful. Set flag to trigger delayed redirect.
        console.log("Login successful. Setting redirect flag.");
        shouldRedirect = true;
      } else {
        // Display server-side error message
        setFormError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login form submission error:', error);
      setFormError('A network error occurred. Please try again.');
    } finally {
      // 2. Stop the loading state
      setIsSubmitting(false);

      // 3. CRITICAL FIX: Use a timeout for reliable redirection
      if (shouldRedirect) {
         console.log("Executing delayed router push in 50ms.");
         
         // A small delay ensures Firebase state and component re-renders complete first
         setTimeout(() => {
             router.push('/'); 
         }, 50); 
      }
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-center text-gray-900">Sign In to Your Account</h2>
      
      {formError && (
        <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}