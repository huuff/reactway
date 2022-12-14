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
    `hover:bg-${conwayTheme.light.panelHighlight.className}`,
    `hover:bg-${conwayTheme.dark.panelHighlight.className}`,

    `bg-${conwayTheme.light.windowBackground.className}`,
    `bg-${conwayTheme.dark.windowBackground.className}`,
    `bg-${conwayTheme.light.panelHighlight.className}`,
    `bg-${conwayTheme.dark.panelHighlight.className}`,

    `text-${conwayTheme.light.text.className}`,
    `text-${conwayTheme.dark.text.className}`,
    `text-${conwayTheme.light.panelMuted.className}`,
    `text-${conwayTheme.dark.panelMuted.className}`,

    `bg-${conwayTheme.light.panel.className}`,
    `bg-${conwayTheme.dark.panel.className}`,

    `hover:bg-${conwayTheme.light.button.hover.className}`,
    `hover:bg-${conwayTheme.dark.button.hover.className}`,
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
        [conwayTheme.light.panelHighlight.className]: conwayTheme.light.panelHighlight.color,
        [conwayTheme.dark.panelHighlight.className]: conwayTheme.dark.panelHighlight.color,

        [conwayTheme.light.text.className]: conwayTheme.light.text.color,
        [conwayTheme.dark.text.className]: conwayTheme.dark.text.color,

        [conwayTheme.light.panel.className]: conwayTheme.light.panel.color,
        [conwayTheme.dark.panel.className]: conwayTheme.dark.panel.color,

        [conwayTheme.light.panelMuted.className]: conwayTheme.light.panelMuted.color,
        [conwayTheme.dark.panelMuted.className]: conwayTheme.dark.panelMuted.color,

        [conwayTheme.light.button.hover.className]: conwayTheme.light.button.hover.color,
        [conwayTheme.dark.button.hover.className]: conwayTheme.dark.button.hover.color,
      },
    },
  },
  plugins: [],
}
