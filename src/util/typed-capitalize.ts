function typedCapitalize<T extends string>(input: T): Capitalize<T> {
    return input.charAt(0).toUpperCase() + input.substring(1, input.length) as Capitalize<T>;
}

export { typedCapitalize };