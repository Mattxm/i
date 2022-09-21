/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {light: "#f5f5f5", dark: "#2b2b2b"},
        secondary: {light: "#f7f7f7", dark: "#1c1c1c"},
        thirdary: "#363636",
        highlight: "#f2ef8a",
      },
      maxWidth: {
        "xxs": "10rem",
      }
    },
  },
  darkMode: 'class',
  plugins: [require("@thoughtbot/tailwindcss-aria-attributes"),],
}
