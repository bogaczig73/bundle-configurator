/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#196FCA',
          light: '#D0E3F4',
          hover: '#ECF4FB',
        },
        accent: {
          DEFAULT: '#F04A6A',
          checkbox: '#F48096',
          selected: '#F9B7C3',
          hover: '#FDE4E8',
        },
        gray: {
          disabled: '#B2B2B2',
          input: '#F2F2F2',
        }
      }
    },
  },
  plugins: [],
}