/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-color)",
        surface: "var(--surface-color)",
        "surface-hover": "var(--surface-hover-color)",
        border: "var(--border-color)",
        primary: "#F2545B",
        "primary-hover": "#FF6B72",
        secondary: "#FFC857",
        "text-primary": "var(--text-primary-color)",
        "text-secondary": "var(--text-secondary-color)",
      },
      borderRadius: {
        xl: "10px",
        lg: "8px",
      },
    },
  },
  plugins: [],
};
