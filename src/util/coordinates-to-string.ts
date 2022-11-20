import { Coordinates } from "../grid/grid";

// TODO: Use this wherever I use JSON.stringify
export function coordinatesToString([x, y]: Coordinates): string {
    return `(${x},${y})`;
}

export default coordinatesToString;