/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        water: {
          50: '#eff8ff',
          100: '#dbeffe',
          200: '#bfe3fd',
          300: '#93d1fc',
          400: '#60b7f9',
          500: '#3b97f5',
          600: '#2578e9',
          700: '#1d62d6',
          800: '#1e4fad',
          900: '#1e4589',
        },
      },
    },
  },
  plugins: [],
}


