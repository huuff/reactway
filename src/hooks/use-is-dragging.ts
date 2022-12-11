import { useMouseEvents } from "beautiful-react-hooks";
import { useState } from "react";

/**
 * Detects wether the mouse has been held for some time
 * @param thresholdMs Number of milliseconds it takes to have the mouse button pressed down to be considered to have been dragging
 * @returns 
 */
function useIsDragging(thresholdMs: number = 100) {
    const [ isMouseHeld, setIsMouseHeld ] = useState(false);
    const [ timeoutId, setTimeoutId ] = useState<ReturnType<typeof setTimeout> | null>(null);
    const { onMouseDown, onMouseUp } = useMouseEvents();

    onMouseDown(() => {
        if (!timeoutId) {
            setTimeoutId(setTimeout(() => {
                setIsMouseHeld(true);
             }, thresholdMs));
        }
    });

    onMouseUp(() => {
        setIsMouseHeld(false);
        if (timeoutId) {
            clearInterval(timeoutId);
            setTimeoutId(null);
        }
    });

    return isMouseHeld;
}

export { useIsDragging };