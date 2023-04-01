/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Poppins"],
    },
    extend: {
      colors: {
        teal: {
          50: "#f0fdfc",
          100: "#cef9f7",
          200: "#9cf3ef",
          300: "#63e5e5",
          400: "#33cace",
          500: "#189fa5",
          600: "#12878f",
          700: "#136b72",
          800: "#14545b",
          900: "#15484c",
          950: "#06272d",
        },
        pink: {
          50: "#faf5fa",
          100: "#f7ecf6",
          200: "#f1d9ef",
          300: "#e6bbe1",
          400: "#d690cd",
          500: "#c66eb7",
          600: "#b3559f",
          700: "#973f82",
          800: "#7e366c",
          900: "#6a315c",
          950: "#3f1834",
        },
      },
    },
  },
  plugins: [],
};
