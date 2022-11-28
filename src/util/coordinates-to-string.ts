import { Coordinates } from "../grid/grid";

// Cache to prevent creating too many strings
const INITIAL_COORDINATES_TO_STRING_CACHE_SIZE = 100;
let coordinatesToStringCache = createCoordinatesToStringCache(INITIAL_COORDINATES_TO_STRING_CACHE_SIZE);

function createCoordinatesToStringCache(size: number): string[][] {
    return [... new Array(size)].map(() => new Array(size));
}

const coordinatesToString = ([x, y]: Coordinates): string => {
    if (x < 0 || y < 0) {
        return `(${x},${y})`;
    } else if (x > coordinatesToStringCache.length - 1 || y > coordinatesToStringCache.length - 1) {
        coordinatesToStringCache = createCoordinatesToStringCache(Math.max(x, y) + 1);
    }

    const cached = coordinatesToStringCache[y][x];
    if (cached) {
        return cached;
    } else {
        const value = `(${x},${y})`;
        coordinatesToStringCache[y][x] = value;
        return value;
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