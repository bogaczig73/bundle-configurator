/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'bg-abraYellow',
    'bg-abraOrange',
    'bg-abraMagenta',
    'border-abraYellow',
    'border-abraOrange',
    'border-abraMagenta',
    'text-abraYellow',
    'text-abraOrange',
    'text-abraMagenta',
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
        abraMagenta: {
          DEFAULT: '#e1007b',//'rgb(207, 60, 128)',
          tone: {
            100: '#F79CAE',
            200: '#FABDC9',
            300: '#F48096',
          },
          hover: '#F14F6F',
        },
        abraOrange: {
          DEFAULT: '#e96b46', //'rgb(215, 97, 78)',
          light: '#ec7600',
        },
        abraYellow: {
          DEFAULT: '#f6b200',//'rgb(243, 178, 68)',
          light: '#FFDEA9',
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}