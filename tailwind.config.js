/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        surface: 'var(--bg-surface)',
        card: 'var(--bg-card)',
        obsidian: '#05070a',
        midnight: '#0f172a',
        'electric-cyan': '#00f0ff',
        'hyper-violet': '#b026ff',
        accent: {
          DEFAULT: '#00f0ff',
          soft: 'rgba(0, 240, 255, 0.15)',
        },
      },
      letterSpacing: {
        'tech-wide': '0.05em',
        'tech-wider': '0.1em',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%':      { transform: 'translate(20px, -20px) scale(1.1)' },
          '66%':      { transform: 'translate(-10px, 15px) scale(0.9)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'float-y': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        'bloom-pulse': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(1.1)' },
        },
        'glow-pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.4))' },
          '50%':      { filter: 'drop-shadow(0 0 25px rgba(0, 240, 255, 0.8))' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'pulse-ring': {
          '0%':   { boxShadow: '0 0 0 0 rgba(99,102,241,0.4)' },
          '70%':  { boxShadow: '0 0 0 10px rgba(99,102,241,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(99,102,241,0)' },
        },
        'slide-down': {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'stagger-in': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease both',
        'fade-in-up': 'fadeInUp 0.5s ease both',
        'scale-in':   'scaleIn 0.3s ease both',
        'shimmer':    'shimmer 1.5s ease infinite',
        'blob':       'blob 7s infinite',
        'float':      'float 3s ease-in-out infinite',
        'float-y':    'float-y 6s ease-in-out infinite',
        'bloom-pulse':'bloom-pulse 8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'spin-slow':  'spin-slow 8s linear infinite',
        'pulse-ring': 'pulse-ring 2s ease infinite',
        'slide-down': 'slide-down 0.3s ease both',
        'stagger-in': 'stagger-in 0.5s ease forwards',
      },
      boxShadow: {
        'accent': '0 0 40px rgba(99,102,241,0.15)',
        'card':   '0 4px 24px rgba(0,0,0,0.4)',
        'glow':   '0 0 30px rgba(99,102,241,0.2)',
      },
      borderRadius: {
        'xl2': '18px',
        '2xl': '24px',
      },
      backdropBlur: {
        xs: '4px',
      },
    },
  },
  plugins: [],
};
