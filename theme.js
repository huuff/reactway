module.exports =  {
  light: {
    cell: {
      alive: {
        className: "light-alive-cell",
        color: "#000000",
      },
      dead: {
        className: "light-dead-cell",
        color: "#F0F0F0",
      },
      hovered: {
        alive: {
          className: "hovered-light-alive-cell",
          color: "#660000",
        },
        dead: {
          className: "hovered-light-dead-cell",
          color: "#FF3333",
        },
      },
    },
    windowBackground: {
      className: "light-window-background",
      color: "#F1F5F9",
    },
    text: {
      className: "light-text-color",
      color: "#0F172A",
    },
    panel: {
      className: "light-panel-background",
      color: "#E2E8F0",
    },
    panelHighlight: {
      className: "light-panel-highlight",
      color: "#D1D7E1"
    },
    panelMuted: {
      className: "light-panel-muted",
      color: "#707070",
    },
    button: {
      hover: {
        className: "light-button-hover",
        color: "#CBD5E1",
      },
    },
  },

  dark:  {
    cell: {
      alive: {
        className: "dark-alive-cell",
        color: "#262626",
      },
      dead: {
        className: "dark-dead-cell",
        color: "#666666",
      },
      hovered: {
        alive: {
          className: "hovered-dark-alive-cell",
          color:"#990000",
        },
        dead: {
          className: "hovered-dark-dead-cell",
          color: "#CC0000",
        },
      },
    },
    windowBackground: {
      className: "dark-window-background",
      color: "#1E293B",
    },
    text: {
      className: "dark-text-color",
      color: "#F1F5F9",
    },
    panel: {
      className: "dark-panel-background",
      color: "#334155",
    },
    panelHighlight: {
      className: "dark-panel-highlight",
      color: "#445266"
    },
    panelMuted: {
      className: "dark-panel-muted",
      color: "#515151",
    },
    button: {
      hover: {
        className: "hover-dark-button",
        color: "#475569",
      },
    },
  },
};

