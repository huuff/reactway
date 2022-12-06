const myCustomTheme = require("./theme.ts");

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  safelist: [
    "h-2", "w-2",
    "h-4", "w-4",
    "h-6", "w-6",
    "h-8", "w-8",
    "h-10", "w-10",
    "h-12", "w-12",
    "h-14", "w-14",
  ],
  theme: {
    extend: {
      colors: {
        "light-alive-cell": myCustomTheme.light.aliveCell,
        "light-dead-cell": myCustomTheme.light.deadCell,
        "dark-alive-cell": myCustomTheme.dark.aliveCell,
        "dark-dead-cell": myCustomTheme.dark.deadCell,
      },
    },
  },
  plugins: [],
}
