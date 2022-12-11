import { useEffect, useRef } from "react";

const useClientSide = <T,>(f: () => T, ssrDefault: T): T=> {
    if (typeof window === "undefined") {
        return ssrDefault;
    }

    // eslint-disable-next-line 
    const result = useRef<T>(ssrDefault);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        result.current = f();
    }, [f]);

    return result.current;
};

export default useClientSide;