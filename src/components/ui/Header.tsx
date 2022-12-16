import classNames from "classnames";
import { FC } from "react";
import { getTheme } from "../../util/get-theme";
import { useDarkMode } from "../../hooks/use-dark-mode";

const Header: FC<{ text: string }> = ({ text }) => {
    const { isDarkMode } = useDarkMode();
    const theme = getTheme(isDarkMode);

    return (
        <header className={classNames(
            "text-3xl",
            "font-bold",
            "text-center",
            "mb-5",
            `text-${theme.text.className}`,
        )}>
            {text}
        </header>
    );
};

export default Header;