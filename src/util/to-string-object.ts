type StringObject<T> = { [key in keyof T]: string };

function toStringObject<T extends {}>(object: T): StringObject<T> {
    return (Object.keys(object) as (keyof T)[]).reduce<StringObject<T>>((acc, key) => ({
        [key]: String(object[key]),
        ...acc,
    }), {} as StringObject<T>)
}

export { toStringObject }