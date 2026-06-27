/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:          '#0A0A0A',
        surface:     '#111111',
        'surface-2': '#1A1A1A',
        gold:        '#C9A84C',
        'gold-light':'#E8C97A',
        'gold-dim':  '#8A6F2E',
        'warm-white':'#F5F0E8',
        muted:       '#7A7A7A',
        error:       '#C0392B',
        success:     '#27AE60',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body:    ['"Cormorant Garamond"', 'serif'],
        ui:      ['"Montserrat"', 'sans-serif'],
      },
      animation: {
        'pulse-gold': 'pulseGold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':    'fadeIn 0.4s ease-in-out',
        'slide-up':   'slideUp 0.4s ease-out',
      },
      keyframes: {
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201, 168, 76, 0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(201, 168, 76, 0)' },
        },
        fadeIn: {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%':   { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)',
      },
    },
  },
  plugins: [],
};
