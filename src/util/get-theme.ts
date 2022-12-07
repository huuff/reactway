import theme from "../../theme";

type ClassAndColor = {
    className: string;
    color: string;
}

type Theme = {
    cell: {
        alive: ClassAndColor;
        dead: ClassAndColor;
        hovered: {
            alive: ClassAndColor;
            dead: ClassAndColor;
        }
    },
    windowBackground: ClassAndColor,
    text: ClassAndColor,
    input: ClassAndColor,
    button: {
        hover: ClassAndColor,
    }
}

function getTheme(darkMode: boolean): Theme {
    return theme[darkMode ? "dark" : "light"];
}

export { getTheme };
export type { Theme };