import { ChangeEvent, useState } from "react";

type NumberInputHookType = {
    value: number | undefined;
    setValue: (nextValue: number | undefined) => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function useNumberInput(initialValue: number): NumberInputHookType {
    const [ value, setValue ] = useState<number | undefined>(initialValue);

    return {
        value,
        setValue,
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.value) {
                setValue(+e.target.value);
            } else {
                setValue(undefined);
            }
        },
    }
}

export { useNumberInput };