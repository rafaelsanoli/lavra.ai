import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ==========================================
      // CORES LAVRA.AI
      // ==========================================
      colors: {
        // Brand Green Scale
        brand: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#17522C', // ★ Principal
          950: '#0F3D1C',
        },
        // Gold Accent (uso seletivo)
        gold: {
          DEFAULT: '#C9A227',
          light: '#E3C766',
          dark: '#A68419',
        },
        // Superfícies Light Mode
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#FAFAFA',
          hover: '#F5F5F5',
        },
        // Superfícies Dark Mode
        'surface-dark': {
          DEFAULT: '#1A1A1A',
          secondary: '#141414',
          hover: '#262626',
          bg: '#0A0A0A',
        },
      },

      // ==========================================
      // TIPOGRAFIA
      // ==========================================
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        // Display
        'display-2xl': ['4.5rem', { lineHeight: '1', fontWeight: '700', letterSpacing: '-0.02em' }],
        'display-xl': ['3.75rem', { lineHeight: '1', fontWeight: '700', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.02em' }],
        // Headings
        'h1': ['1.875rem', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.02em' }],
        'h2': ['1.5rem', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.02em' }],
        'h3': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['1.125rem', { lineHeight: '1.4', fontWeight: '500' }],
        // Body
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body-md': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        // Labels
        'label': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
        'overline': ['0.6875rem', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '0.1em' }],
      },

      // ==========================================
      // ESPAÇAMENTO
      // ==========================================
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },

      // ==========================================
      // BORDER RADIUS
      // ==========================================
      borderRadius: {
        'sm': '6px',
        'DEFAULT': '8px',
        'md': '10px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },

      // ==========================================
      // SOMBRAS
      // ==========================================
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'sm': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'xl': '0 20px 40px rgba(0, 0, 0, 0.15)',
        'ring-brand': '0 0 0 3px rgba(23, 82, 44, 0.15)',
        'ring-brand-dark': '0 0 0 3px rgba(74, 222, 128, 0.2)',
        'ring-error': '0 0 0 3px rgba(220, 38, 38, 0.15)',
      },

      // ==========================================
      // ANIMAÇÕES
      // ==========================================
      transitionDuration: {
        'instant': '75ms',
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
        'slower': '500ms',
      },
      transitionTimingFunction: {
        'ease-out-custom': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-custom': 'cubic-bezier(0.4, 0, 1, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 500ms ease-out forwards',
        'fade-in-up': 'fadeInUp 600ms ease-out forwards',
        'fade-in-down': 'fadeInDown 600ms ease-out forwards',
        'fade-in-left': 'fadeInLeft 600ms ease-out forwards',
        'fade-in-right': 'fadeInRight 600ms ease-out forwards',
        'scale-in': 'scaleIn 500ms ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },

      // ==========================================
      // CONTAINERS
      // ==========================================
      maxWidth: {
        'content': '1280px',
        'text': '768px',
        'narrow': '640px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

export default config
