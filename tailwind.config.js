/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    './src/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/layout/**/*.{js,jsx,ts,tsx}',
    './node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

