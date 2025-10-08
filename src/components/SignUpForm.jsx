"use client";

import React, { useState } from 'react';
import { useAuth } from '@/components/AuthContext'; // Path should be correct
import { useRouter } from 'next/navigation';

const SignUpForm = () => {
  // We only need the signUp function, the router, and local form state/errors
  const { signUp } = useAuth(); // We don't need 'loading' or 'error' from context, we use local state for immediate feedback
  const router = useRouter();

  // State for form fields
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  // State for showing form submission status/errors
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    const { email, username, password, confirmPassword } = formData;

    // Client-side validation
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Call the signUp function from AuthContext (which now handles the API and client sign-in)
      const result = await signUp({ email, username, password });

      if (result.success) {
        // Successful sign-up and Firebase sign-in
        router.push('/'); // Redirect to the homepage or dashboard
      } else {
        // Handle server/API errors returned by signUp
        setFormError(result.message || 'Sign up failed. Please try again.');
      }
    } catch (err) {
      // Handle unexpected client-side errors
      console.error("Sign-up process failed:", err);
      setFormError('An unexpected error occurred during sign up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // The only control for button state is whether the form is actively submitting
  const isDisabled = isSubmitting;

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Create Your HelpChain Account</h2>
      
      {/* Display errors from form validation or AuthContext */}
      {formError && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... (All your form fields remain the same) ... */}
        
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Username Field */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password (min 6 chars)</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isDisabled ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {isSubmitting ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a onClick={() => router.push('/login')} className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
          Log in
        </a>
      </p>
    </div>
  );
};

export default SignUpForm;