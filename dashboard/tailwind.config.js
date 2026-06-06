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
        primaryYellow: "#F4E600",
        glassBg: "rgba(10,15,35,0.75)",
        glassBorder: "rgba(255,255,255,0.08)",
        accentBlue: "#4A90FF",
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
