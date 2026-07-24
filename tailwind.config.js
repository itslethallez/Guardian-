/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#0a0e27',
        'dark-card': '#12172d',
        'charcoal': '#1a2139',
        'ivory': '#f5f3f0',
        'gold': '#d4af91',
        'teal': '#3fb8a0',
        'teal-light': '#5ac9b0',
        'amber': '#d99d3f',
        'safety-green': '#2ecc71',
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', '16px'],
        'sm': ['14px', '20px'],
        'base': ['16px', '24px'],
        'lg': ['18px', '28px'],
        'xl': ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['32px', '40px'],
        '4xl': ['40px', '48px'],
        '5xl': ['48px', '56px'],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '48px',
        '4xl': '64px',
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'base': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.12)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.15)',
        'lg': '0 8px 32px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'waveform': 'waveform 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 0.5s ease-in',
        'slide-up': 'slide-up 0.5s ease-out',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { 'opacity': '0.3' },
          '50%': { 'opacity': '1' },
        },
        'waveform': {
          '0%, 100%': { 'height': '6px' },
          '50%': { 'height': '20px' },
        },
        'fade-in': {
          'from': { 'opacity': '0' },
          'to': { 'opacity': '1' },
        },
        'slide-up': {
          'from': { 'transform': 'translateY(16px)', 'opacity': '0' },
          'to': { 'transform': 'translateY(0)', 'opacity': '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
