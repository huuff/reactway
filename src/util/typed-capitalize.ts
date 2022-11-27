import { capitalize } from "lodash";

function typedCapitalize<T extends string>(input: T): Capitalize<T> {
    return capitalize(input) as Capitalize<T>;
}

export { typedCapitalize };