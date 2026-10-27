/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FCFBF9',
          100: '#F8F7F2', // Warm ivory background
          200: '#EFECE2',
          300: '#E4DFD0',
        },
        forest: {
          50: '#F0F6F1',
          100: '#E3EDE4', // Soft green badge/highlight
          200: '#C2D9C5',
          600: '#346B54',
          700: '#2B5B47',
          800: '#234D3C', // Deep forest green brand primary
          900: '#173629',
          950: '#0E2219',
        },
        dark: {
          800: '#2C332B',
          900: '#20251F', // Primary dark text
          950: '#141813',
        },
        muted: {
          400: '#9DA39B',
          500: '#777D75', // Muted text
          600: '#5C625A',
        },
        border: {
          DEFAULT: '#E5E7E0', // Refined subtle border
          dark: '#D0D4CA',
        },
        cream: '#FAF9F5',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        subtle: '0 2px 10px rgba(32, 37, 31, 0.04)',
        card: '0 4px 20px -2px rgba(35, 77, 60, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 30px -4px rgba(35, 77, 60, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        dropdown: '0 10px 25px -5px rgba(20, 24, 19, 0.1), 0 8px 10px -6px rgba(20, 24, 19, 0.06)',
      },
    },
  },
  plugins: [],
}
