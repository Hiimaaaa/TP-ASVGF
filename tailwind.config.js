/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#19183B',
        secondary: '#708993',
        accent: '#A1C2BD',
        light: '#E7F2EF',
      },
    },
  },
  plugins: [],
}
