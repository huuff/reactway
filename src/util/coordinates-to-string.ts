import { Coordinates } from "../grid/grid";

const coordinatesToString = ([x, y]: Coordinates): string => {
    return `(${x},${y})`
};

const COORDINATES_REGEX = /\((\d+),(\d+)\)/
function stringToCoordinates(string: string): Coordinates {
    const match = string.match(COORDINATES_REGEX);

    if (!match)
        throw new Error(`String ${string} is not a coordinate`);


    return [+match[1], +match[2]];
}

export { coordinatesToString, stringToCoordinates };