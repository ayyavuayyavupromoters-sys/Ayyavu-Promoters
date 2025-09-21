/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'maroon': {
          900: '#4a0e0e',
          800: '#5c1111',
          700: '#6e1414',
          600: '#801717',
          500: '#921a1a',
          400: '#a41d1d',
          300: '#b62020',
          200: '#c82323',
          100: '#da2626',
        }
      }
    },
  },
  plugins: [],
};
