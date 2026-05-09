import { AuthProvider } from '@/app/components/AuthContext';
import './globals.css';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'HelpChain — Transparent NGO Donations',
  description: 'Connect with verified NGOs, track every rupee, and build trust through transparency.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1c2233',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#f0f4ff',
              borderRadius: '12px',
              fontSize: '0.875rem',
            },
          }}
        />
      </body>
    </html>
  );
}