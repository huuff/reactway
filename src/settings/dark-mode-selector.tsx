import { useTernaryDarkMode } from "usehooks-ts"
import { faSun, faMoon, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type DarkModeSelectorProps = {
    className?: string;
}

// TODO: Test
const DarkModeSelector = ({ className }: DarkModeSelectorProps) => {
    const { ternaryDarkMode, toggleTernaryDarkMode } = useTernaryDarkMode();
    const iconRef = useRef<IconProp>();

    useEffect(() => {
        switch (ternaryDarkMode) {
            case "dark":
                iconRef.current =  faMoon;
                break;
            case "light":
                iconRef.current = faSun;
                break;
            case "system":
                iconRef.current = faGear;
                break;
        }
    }, [ternaryDarkMode])

    return (
        <button className={`${className || ""} border rounded-lg drop-shadow-md px-2 py-1`} 
                onClick={toggleTernaryDarkMode}>
            {iconRef.current && <FontAwesomeIcon icon={iconRef.current} className="w-4 h-4" />}
        </button>
    )
}

export default DarkModeSelector;