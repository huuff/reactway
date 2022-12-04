import { useDarkMode } from "usehooks-ts"
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type DarkModeSelectorProps = {
    className?: string;
}

// TODO: Test
const DarkModeSelector = ({ className }: DarkModeSelectorProps) => {
    const { isDarkMode, toggle } = useDarkMode();
    const iconRef = useRef<IconProp>();

    useEffect(() => {
            if (isDarkMode)
                iconRef.current =  faMoon;
            else
                iconRef.current = faSun;
    }, [isDarkMode])

    return (
        <button className={`
            ${className || ""}
            border 
            rounded-lg 
            drop-shadow-md 
            px-2
            py-1
            ${isDarkMode ? "bg-slate-600" : "bg-slate-100"}
            `} 
                onClick={toggle}>
            {iconRef.current && <FontAwesomeIcon 
                    icon={iconRef.current} 
                    className={`w-4 h-4 ${isDarkMode ? "text-yellow-300" : "text-slate-900"}`}
                />}
        </button>
    )
}

export default DarkModeSelector;