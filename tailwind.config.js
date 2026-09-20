/** @type {import('tailwindcss').Config} */
// Palet dari Brief Desain Logo PERISAI:
// Teal Dark #32848D · Teal Medium #619892 · Sage Green #93B39D
// Light Olive #B0C99E · Soft Lime #CBDCA5 · Off White #F6FAF5
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        perisai: {
          50: "#F6FAF5",
          100: "#EDF4EA",
          200: "#DCEAD3",
          300: "#CBDCA5",
          400: "#B0C99E",
          500: "#93B39D",
          600: "#619892",
          700: "#32848D",
          800: "#276B73",
          900: "#1E5359",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(30,83,89,0.06), 0 4px 16px -4px rgba(30,83,89,0.10)",
        "card-hover": "0 2px 4px rgba(30,83,89,0.08), 0 12px 28px -8px rgba(50,132,141,0.22)",
        modal: "0 24px 64px -16px rgba(30,83,89,0.35)",
      },
      borderRadius: {
        "2.5xl": "1.25rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
