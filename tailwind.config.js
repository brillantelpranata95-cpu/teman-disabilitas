/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        temon: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
      },
      spacing: {
        '4.5': '1.125rem',
        '6.5': '1.625rem',
        '18': '4.5rem',
      },
      borderRadius: {
        control: '0.75rem',
        surface: '1rem',
      },
      boxShadow: {
        'apple-sm': '0 2px 8px rgb(15 23 42 / 0.06)',
        'apple-md': '0 12px 30px rgb(15 23 42 / 0.08)',
      },
    },
  },
  plugins: [],
};
