// src/app/(auth)/signup/page.js

import SignUpForm from "@/app/components/SignUpForm";
export default function SignUpPage() {
  return (
    // Render the client component containing the form
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <SignUpForm/>
    </div>
  );
}
