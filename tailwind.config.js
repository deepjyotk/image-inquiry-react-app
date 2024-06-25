/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // Enable dark mode support
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1d4ed8', // A nice blue color
          light: '#3b82f6',   // Lighter shade of blue
          dark: '#1e40af',    // Darker shade of blue
        },
        secondary: {
          DEFAULT: '#f97316', // A vibrant orange color
          light: '#fb923c',   // Lighter shade of orange
          dark: '#ea580c',    // Darker shade of orange
        },
        background: {
          DEFAULT: '#111827', // Dark background
        },
        text: {
          DEFAULT: '#f9fafb', // Light text
        },
        inputBg: {
          DEFAULT: '#1f2937', // Background for input fields
        },
        inputBorder: {
          DEFAULT: '#374151', // Border color for input fields
        }
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
