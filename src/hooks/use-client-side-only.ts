const useClientSideOnly = <T,>(f: () => T, ssrDefault: T): T => {
    if (typeof window === "undefined") {
        return ssrDefault;
    }

    else return f();
};

export default useClientSideOnly;