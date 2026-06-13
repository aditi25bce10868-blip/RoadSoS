/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary:   '#e53935',
        secondary: '#1a1a2e',
        accent:    '#f5a623',
      },
    },
  },
  plugins: [],
};
