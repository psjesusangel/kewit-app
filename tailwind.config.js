/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Kewit dark theme colors (concert venue vibes)
        background: '#0a0a0a',
        surface: '#1a1a1a',
        primary: {
          purple: '#a855f7',
          blue: '#3b82f6',
          pink: '#ec4899',
        },
        accent: {
          cyan: '#06b6d4',
          violet: '#8b5cf6',
        }
      },
    },
  },
  plugins: [],
}