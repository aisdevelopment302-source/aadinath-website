/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F26522',
          'orange-dark': '#D45A1A',
          'orange-light': '#F58A5E',
        },
      },
    },
  },
  plugins: [],
}
