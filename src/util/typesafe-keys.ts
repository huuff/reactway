function typesafeKeys<T>(obj: T): (keyof T)[] {
    const result: (keyof T)[] = [];
    for (const key in obj) {
        result.push(key);
    }

    return result;
}

export { typesafeKeys };