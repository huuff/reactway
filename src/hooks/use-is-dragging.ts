import { useMouseEvents } from "beautiful-react-hooks";
import { useState } from "react";

function useIsDragging() {
    const [ isMouseHeld, setIsMouseHeld ] = useState(false);
    const { onMouseDown, onMouseUp } = useMouseEvents();

    onMouseDown(() => {
        setIsMouseHeld(true);
    })

    onMouseUp(() => {
        setIsMouseHeld(false);
    })

    return isMouseHeld;
}

export { useIsDragging };