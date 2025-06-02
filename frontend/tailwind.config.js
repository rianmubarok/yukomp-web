/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Helvetica", "Arial", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2.5rem",
      },
      colors: {
        lightGrayBlue: "#E8E8F4",
        lightGreen: "#D0F0A0",
      },
    },
  },
  plugins: [],
};
