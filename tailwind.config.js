const conwayTheme = require("./theme.js");

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
    `bg-${conwayTheme.light.cell.alive.className}`,
    `bg-${conwayTheme.light.cell.dead.className}`,
    `bg-${conwayTheme.dark.cell.alive.className}`,
    `bg-${conwayTheme.dark.cell.dead.className}`,

    `hover:bg-${conwayTheme.light.cell.hovered.alive.className}`,
    `hover:bg-${conwayTheme.light.cell.hovered.dead.className}`,
    `hover:bg-${conwayTheme.dark.cell.hovered.alive.className}`,
    `hover:bg-${conwayTheme.dark.cell.hovered.dead.className}`,

    `bg-${conwayTheme.light.windowBackground.className}`,
    `bg-${conwayTheme.dark.windowBackground.className}`,
  ],
  theme: {
    extend: {
      colors: {
        [conwayTheme.light.cell.alive.className]: conwayTheme.light.cell.alive.color,
        [conwayTheme.light.cell.dead.className]: conwayTheme.light.cell.dead.color,
        [conwayTheme.dark.cell.alive.className]: conwayTheme.dark.cell.alive.color,
        [conwayTheme.dark.cell.dead.className]: conwayTheme.dark.cell.dead.color,

        [conwayTheme.light.windowBackground.className]: conwayTheme.light.windowBackground.color,
        [conwayTheme.dark.windowBackground.className]: conwayTheme.dark.windowBackground.color,

        [conwayTheme.light.cell.hovered.alive.className]: conwayTheme.light.cell.hovered.alive.color,
        [conwayTheme.light.cell.hovered.dead.className]: conwayTheme.light.cell.hovered.dead.color,
        [conwayTheme.dark.cell.hovered.alive.className]: conwayTheme.dark.cell.hovered.alive.color,
        [conwayTheme.dark.cell.hovered.dead.className]: conwayTheme.dark.cell.hovered.dead.color,
      },
    },
  },
  plugins: [],
}
