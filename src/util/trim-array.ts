import takeRight from "lodash/takeRight";

type TrimArrayReturnType<T> = {
    readonly array: T[],
    readonly newLength: number;
}

function trimArray<T>(array: T[], length: number): TrimArrayReturnType<T> {
    if (array.length > length) {
        return {
            array: takeRight(array, length),
            newLength: length,
        }
    } else {
        return {
            array,
            newLength: array.length,
        }
    }
}

export { trimArray };