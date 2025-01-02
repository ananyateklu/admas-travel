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
        primary: {
          DEFAULT: "#5C7355",
          50: "#f2f5f1",
          100: "#e4ebe2",
          200: "#c9d7c5",
          300: "#adc3a8",
          400: "#92af8b",
          500: "#5C7355",
          600: "#4a5c44",
          700: "#374533",
          800: "#252e22",
          900: "#121711",
        },
        forest: {
          DEFAULT: "#2D5A27",
          50: "#EFF4EE",
          100: "#DFE9DE",
          200: "#BFD3BD",
          300: "#9FBD9C",
          400: "#7FA77B",
          500: "#2D5A27",
          600: "#254B20",
          700: "#1D3C19",
          800: "#152D12",
          900: "#0C1E0B",
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
