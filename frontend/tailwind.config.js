/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkbg: "#120d1d",
        darkcard: "#1e152a",
        darktext: "#f3f4f6",
        accent: "#f43f5e",

      },
    },
  },
  plugins: [],
}

