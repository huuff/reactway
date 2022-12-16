import classNames from "classnames";
import { FC, ReactNode } from "react";
import { useDarkMode } from "../../hooks/use-dark-mode";
import { getTheme } from "../../util/get-theme";

const SubHeader: FC<{children: ReactNode}> = ({children}) => {
    const { isDarkMode } = useDarkMode();
    const theme = getTheme(isDarkMode);


    return <p className={classNames(
        "font-light",
        "italic",
        "text-center", 
        "mb-5",
        "sm:px-24",
        "md:px-48",
        `text-${theme.text.className}`,
        )}>
        { children }
    </p>;
};

export default SubHeader;