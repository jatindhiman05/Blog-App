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
        darkbg: "var(--darkbg, #0f0a1a)",
        darkcard: "var(--darkcard, #1a1030)",
        darktext: "var(--darktext, #f8fafc)",
        accent: "var(--accent, #e879f9)",
      }
    }
  },
  plugins: [],
}

