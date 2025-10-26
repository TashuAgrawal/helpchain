// src/app/layout.tsx (Alternative concise syntax)

import { AuthProvider } from '@/app/components/AuthContext';
import './globals.css'; 
import { ReactNode } from 'react'; // Still need this import

// Define the type directly in the function parameter list
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}