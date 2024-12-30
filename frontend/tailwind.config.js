/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: "#0F172A",
          50: "#1E293B",
          100: "#1A2234",
          200: "#151C2C",
          300: "#111827",
          400: "#0D1320",
          500: "#0A0F1A",
        },
        gold: {
          DEFAULT: "#D4AF37",
          50: "#F4E4B5",
          100: "#F0DCA3",
          200: "#E8CC7E",
          300: "#E0BC59",
          400: "#D8AD34",
          500: "#B89530",
          600: "#9C7C28",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
