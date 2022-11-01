import { Grid, Coordinates } from "./grid";

function contains(grid: Grid, x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x <= (grid.width - 1) && y <= (grid.height - 1);
}

function getNeighbours(grid: Grid, x: number, y: number): Coordinates[] {
    return [
        [x-1, y] as const,
        [x, y+1] as const,
        [x+1, y] as const,
        [x, y-1] as const,
    ].filter((it) => contains(grid, ...it))
}

function liveNeighbours(grid: Grid, x: number, y: number): number {
    const boolToInt = (b: boolean): number => b ? 1 : 0;
    return getNeighbours(grid, x, y)
        .map((it) => boolToInt(grid.get(...it)))
        .reduce((acc, it) => acc + 1)
}

export { contains, getNeighbours, liveNeighbours }