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
      <body className="font-sans antialiased text-primary min-h-screen relative overflow-x-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-midnight to-obsidian">
        {/* Antigravity Atmosphere Light Blooms */}
        <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
          <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-electric-cyan/20 blur-[120px] animate-bloom-pulse mix-blend-screen" />
          <div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-hyper-violet/20 blur-[120px] animate-bloom-pulse delay-1000 mix-blend-screen" />
          <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-electric-cyan/10 blur-[150px] animate-bloom-pulse delay-2000 mix-blend-screen" />
        </div>

        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(28, 34, 51, 0.4)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255,255,255,0.05)',
              color: '#f0f4ff',
              borderRadius: '18px',
              fontSize: '0.875rem',
              boxShadow: '0 4px 24px rgba(0, 240, 255, 0.1)',
            },
          }}
        />
      </body>
    </html>
  );
}