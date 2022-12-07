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
  }
};

