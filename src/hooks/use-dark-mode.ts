import { useState } from "react";
import { useDarkMode as tsHooksUseDarkMode, useEffectOnce } from "usehooks-ts";

function useDarkMode(): ReturnType<typeof tsHooksUseDarkMode> {
    const actualValues = tsHooksUseDarkMode();
    const fakeValues: ReturnType<typeof tsHooksUseDarkMode> = {
        isDarkMode: false,
        toggle: () => {},
        enable: () => {},
        disable: () => {},
    };

    const [ isClientSide, setIsClientSide ] = useState(false);

    useEffectOnce(() => {
        setIsClientSide(true);
    });


    return isClientSide ? actualValues : fakeValues;
}

export { useDarkMode };