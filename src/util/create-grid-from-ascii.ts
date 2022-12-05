import tuple from "immutable-tuple";
import { Coordinates, Grid } from "../grid/grid";
import { SetGrid } from "../grid/set-grid";

function createGridFromAscii(ascii: string): Grid {
    const lines = ascii.split("\n").filter((it) => it.trim().length > 0);
    const height = lines.length;
    const width = lines[0].trim().length;

    const aliveCells = new Set<Coordinates>();

    for (const [y, line] of lines.entries()) {
        const lineWithoutWhitespace = line.trim();
        for (let x = 0; x < lineWithoutWhitespace.length; x++) {
            if (lineWithoutWhitespace[x] === "#") {
                aliveCells.add(tuple(x, y))
            }
        }
    }

    return new SetGrid(aliveCells, height, width);
}

export { createGridFromAscii };