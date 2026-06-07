/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        darkNavy: "#0F172A",
        gold: "#D4AF37",
        pureWhite: "#FFFFFF",
      },
      backdropBlur: {
        xs: "20px",
      },
      borderRadius: {
        xl: "24px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        tamil: ["'Noto Serif Tamil'", "serif"],
      },
    },
  },
  plugins: [],
};
