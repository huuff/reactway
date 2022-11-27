import { Coordinates } from "../grid/grid";

// TODO: Set size dynamically?
// Cache to prevent creating too many strings
const COORDINATES_TO_STRING_CACHE_SIZE = 200;
const COORDINATES_TO_STRING_CACHE =
    [... new Array(COORDINATES_TO_STRING_CACHE_SIZE)]
        .map(() => new Array(COORDINATES_TO_STRING_CACHE_SIZE))

const coordinatesToString = ([x, y]: Coordinates): string => {
    if (
        x < 0
        || y < 0
        || x > (COORDINATES_TO_STRING_CACHE_SIZE - 1)
        || y > (COORDINATES_TO_STRING_CACHE_SIZE - 1)
    ) {
        return `(${x},${y})`;
    } else {
        const cached = COORDINATES_TO_STRING_CACHE[y][x];
        if (cached) {
            return cached;
        } else {
            const value = `(${x},${y})`;
            COORDINATES_TO_STRING_CACHE[y][x] = value;
            return value;
        }
    }
};

const COORDINATES_REGEX = /\((\d+),(\d+)\)/
function stringToCoordinates(string: string): Coordinates {
    const match = string.match(COORDINATES_REGEX);

    if (!match)
        throw new Error(`String ${string} is not a coordinate`);


    return [+match[1], +match[2]];
}

export { coordinatesToString, stringToCoordinates };