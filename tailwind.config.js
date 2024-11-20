/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#F04A6A',
          checkbox: '#F48096',
          selected: '#F9B7C3',
          hover: '#FDE4E8',
        },
        gray: {
          disabled: '#B2B2B2',
          input: '#F2F2F2',
        },
        magenta: {
          DEFAULT: '#F04A6A',
          light: '#FCDEE4',
          hover: '#F14F6F',
        },
        orange: {
          DEFAULT: '#e7573e',
          light: '#ec7600',
        },
        yellow: {
          DEFAULT: '#ffab26',
          light: '#FFDEA9',
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}