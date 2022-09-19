/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: "#2b2b2b",
        secondary: "#1c1c1c",
        thirdary: "#565656",
        fourthary: "",
        highlight: "#f2ef8a",
      },
      maxWidth: {
        "xxs": "10rem",
      }
    },
  },
  plugins: [require("@thoughtbot/tailwindcss-aria-attributes"),],
}
