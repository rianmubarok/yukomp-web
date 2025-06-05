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
      keyframes: {
        "slide-up-fade-out": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-100%)", opacity: "0" },
        },
        "slide-up-fade-in": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "slide-up-fade-out": "slide-up-fade-out 0.3s ease-out forwards",
        "slide-up-fade-in": "slide-up-fade-in 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};
