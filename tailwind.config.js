/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0B0D12",
        surface: "#151822",
        "surface-hover": "#1D2130",
        border: "#262B3A",
        primary: "#F2545B",
        "primary-hover": "#FF6B72",
        secondary: "#FFC857",
        "text-primary": "#F5F6FA",
        "text-secondary": "#9AA0B4",
      },
      borderRadius: {
        xl: "10px",
        lg: "8px",
      },
    },
  },
  plugins: [],
};
