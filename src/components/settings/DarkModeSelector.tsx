import { useDarkMode } from "usehooks-ts";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

// TODO: Test
const DarkModeSelector = () => {
    const { isDarkMode, toggle } = useDarkMode();
    const iconRef = useRef<IconProp>();

    useEffect(() => {
            if (isDarkMode)
                iconRef.current = faMoon;
            else
                iconRef.current = faSun;
    }, [isDarkMode]);

    // TODO: Theme for the background
    return (
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
                onClick={toggle}>
            {iconRef.current && <FontAwesomeIcon 
                    icon={iconRef.current} 
                    className={`w-4 h-4 ${isDarkMode ? "text-yellow-300" : "text-slate-900"}`}
                />}
        </button>
    );
};

export default DarkModeSelector;