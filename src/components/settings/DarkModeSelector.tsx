import { useDarkMode  } from "../../hooks/use-dark-mode";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ClientSideOnly from "../util/ClientSideOnly";
import { getTheme } from "../../util/get-theme";

const DarkModeSelector = () => {
    const { isDarkMode, toggle } = useDarkMode();
    const icon = isDarkMode ? faMoon : faSun;
    const theme = getTheme(isDarkMode);

    return (
       <ClientSideOnly>
            <button className={`
                fixed
                top-1 
                right-5
                border 
                rounded-lg 
                drop-shadow-md 
                px-2
                py-1
                -z-100
                bg-${theme.button.hover.className}
                `}
                aria-label="toggle dark mode"
                onClick={toggle}>
                <FontAwesomeIcon
                    icon={icon}
                    data-fa-title-id={isDarkMode ? "moon" : "sun"}
                    className={`w-4 h-4 ${isDarkMode ? "text-yellow-300" : "text-slate-900"}`}
                    title={isDarkMode ? "moon" : "sun"}
                />
            </button>
       </ClientSideOnly>
    );
};

export default DarkModeSelector;