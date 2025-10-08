// src/app/(auth)/signup/page.js

import SignUpForm from '@/components/SignUpForm'; // Adjust the path as needed

export default function SignUpPage() {
  return (
    // Render the client component containing the form
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <SignUpForm />
    </div>
  );
}