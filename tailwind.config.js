/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF2442",
          50: "#FFE5E9",
          100: "#FFCCD3",
          200: "#FF99A7",
          300: "#FF667B",
          400: "#FF3350",
          500: "#FF2442",
          600: "#CC1D35",
          700: "#991628",
          800: "#660E1A",
          900: "#33070D",
        },
      },
    },
  },
  plugins: [],
};
