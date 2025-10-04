/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#1a1a1a',
        primary: {
          purple: '#a855f7',
          blue: '#3b82f6',
          pink: '#ec4899',
        },
      },
    },
  },
  plugins: [],
}