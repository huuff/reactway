import { useDarkMode } from "usehooks-ts";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ClientSideOnly from "../util/ClientSideOnly";

const DarkModeSelector = () => {
    const { isDarkMode, toggle } = useDarkMode();
    const icon = isDarkMode ? faMoon : faSun;

    // TODO: Theme for the background
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
                ${isDarkMode ? "bg-slate-600" : "bg-slate-100"}
                `}
                aria-label="toggle dark mode"
                onClick={toggle}>
                <FontAwesomeIcon
                    icon={icon}
                    className={`w-4 h-4 ${isDarkMode ? "text-yellow-300" : "text-slate-900"}`}
                    title={isDarkMode ? "moon" : "sun"}
                />
            </button>
       </ClientSideOnly>
    );
};

export default DarkModeSelector;