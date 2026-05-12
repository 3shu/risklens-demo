/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#065F46',
          mid: '#054d38',
          light: '#0a7a5a',
        },
        accent: {
          DEFAULT: '#10B981',
          dim: '#059669',
        },
        mint: '#6EE7B7',
        ink: {
          DEFAULT: '#0F172A',
          mid: '#1e293b',
          light: '#334155',
        },
        slate: '#64748B',
        mist: '#F0FDF4',
        danger: '#E84545',
        warning: '#F5A623',
        success: '#10B981',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', "'Segoe UI'", 'sans-serif'],
        head: ['Inter', '-apple-system', "'Segoe UI'", 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        button: '999px',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
}
