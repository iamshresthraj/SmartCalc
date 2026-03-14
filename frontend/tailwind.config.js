/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1", // Indigo 500
        secondary: "#14b8a6", // Teal 500
        surface: "#1e293b", // Slate 800
        background: "#0f172a", // Slate 900
        text: "#f8fafc", // Slate 50
        muted: "#94a3b8", // Slate 400
        success: "#22c55e", // Green 500
        danger: "#ef4444", // Red 500
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
