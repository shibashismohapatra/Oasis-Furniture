/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        cream: "#F5F0E8",
        "warm-white": "#FAFAF7",
        gold: "#C9A96E",
        "gold-light": "#E8D5B0",
        dark: "#1A1714",
        "dark-mid": "#2C2823",
        charcoal: "#3D3830",
        "text-muted": "#8A8278",
      },

      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        sans: ["Jost", "sans-serif"],
      },

      animation: {
        "fade-up": "fadeUp 0.8s ease forwards",
      },

      keyframes: {
        fadeUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },

          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },

  plugins: [],
}