import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        body: ['var(--font-inter)', 'sans-serif'],
        headline: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'glitch': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-3px, 3px)' },
          '40%': { transform: 'translate(-3px, -3px)' },
          '60%': { transform: 'translate(3px, 3px)' },
          '80%': { transform: 'translate(3px, -3px)' },
          '100%': { transform: 'translate(0)' },
        },
        'glitch-anim-1': {
          '0%': { clip: 'rect(42px, 9999px, 44px, 0)' },
          '25%': { clip: 'rect(0, 9999px, 0, 0)' },
          '50%': { clip: 'rect(80px, 9999px, 82px, 0)' },
          '75%': { clip: 'rect(0, 9999px, 0, 0)' },
          '100%': { clip: 'rect(60px, 9999px, 62px, 0)' },
        },
        'glitch-anim-2': {
          '0%': { clip: 'rect(65px, 9999px, 67px, 0)' },
          '25%': { clip: 'rect(0, 9999px, 0, 0)' },
          '50%': { clip: 'rect(10px, 9999px, 12px, 0)' },
          '75%': { clip: 'rect(0, 9999px, 0, 0)' },
          '100%': { clip: 'rect(90px, 9999px, 92px, 0)' },
        },
        'expand-fade': {
          '0%': { transform: 'scale(0.5)', opacity: '1' },
          '100%': { transform: 'scale(1.2)', opacity: '0' },
        },
        'ring-glitch-1': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(5px, -5px) scale(0.95)' },
          '50%': { transform: 'translate(0, 0) scale(1)' },
          '75%': { transform: 'translate(-5px, 5px) scale(1.05)' },
        },
        'ring-glitch-2': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(-5px, 5px) scale(1.05)' },
          '50%': { transform: 'translate(0, 0) scale(1)' },
          '75%': { transform: 'translate(5px, -5px) scale(0.95)' },
        },
        'ring-glitch-3': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(3px, 3px) scale(1.02)' },
          '50%': { transform: 'translate(0, 0) scale(1)' },
          '75%': { transform: 'translate(-3px, -3px) scale(0.98)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-slide-up': 'fade-in-slide-up 0.6s ease-out forwards',
        'glitch': 'glitch 2.5s infinite',
        'expand-fade': 'expand-fade 3s infinite linear',
        'ring-glitch-1': 'ring-glitch-1 4s infinite alternate ease-in-out',
        'ring-glitch-2': 'ring-glitch-2 3.5s infinite alternate ease-in-out',
        'ring-glitch-3': 'ring-glitch-3 4.5s infinite alternate ease-in-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
