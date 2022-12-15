import theme from "../../theme";

type ClassAndColor = {
    className: string;
    color: string;
}

type LiveStatusDependent<T> = {
    alive: T,
    dead: T,
}

type Theme = {
    cell: LiveStatusDependent<ClassAndColor> & {
        hovered: LiveStatusDependent<ClassAndColor>
    };
    windowBackground: ClassAndColor;
    text: ClassAndColor;
    panel: ClassAndColor;
    button: {
        hover: ClassAndColor;
    }
}

function getTheme(darkMode: boolean): Theme {
    return theme[darkMode ? "dark" : "light"];
}

export { getTheme };
export type { Theme, LiveStatusDependent, ClassAndColor };