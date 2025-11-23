/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        roboto: ['Roboto', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        bg: {
          light: "#F5F7F8",
          DEFAULT: "#1e88e5",
          dark: "#1E201E",
        },
        text:{
          dark: "#F5F5F5",
          light: "#181C14",
        },
        muted:{
          dark: "#686D76",
        },
        card:{
          dark:"#2f332f",
        },
        accent: "#ff6b6b",
      },
    },
  },
  plugins: [],
};
