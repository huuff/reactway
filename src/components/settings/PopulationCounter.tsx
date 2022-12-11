import { faPerson } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { FC, useMemo } from "react";
import { useDarkMode } from "usehooks-ts";
import { getTheme } from "../../util/get-theme";

const PopulationCounter: FC<{population: number}> = ({population}) => {
    const { isDarkMode } = useDarkMode();
    const theme = useMemo(() => getTheme(isDarkMode), [isDarkMode]);

    return (
        <div className={classNames(
            "fixed",
            "-bottom-1",
            "right-10",
            "rounded-lg",
            "py-1",
            "px-3",
            "flex",
            "flex-row",
            `bg-${theme.windowBackground.className}`,
            `text-${theme.text.className}`
        )}
        >
            <FontAwesomeIcon icon={faPerson} className="w-3 mr-2"/>
            <span>{ population }</span>
        </div>
    );
};

export default PopulationCounter;