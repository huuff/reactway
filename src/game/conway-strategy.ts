import { Grid, Coordinates } from "../grid/grid";

type ConwayStrategy = (grid: Grid, coordinates: Coordinates) => boolean;

const defaultConwayStrategy: ConwayStrategy = (grid: Grid, coordinates: Coordinates): boolean => {
    const currentState = grid.get(...coordinates);
    const liveNeighbours = grid.liveNeighbours(...coordinates);

    if (currentState) { // Cell is alive
        return liveNeighbours === 2 || liveNeighbours === 3;
    } else { // Cell is dead
        return liveNeighbours === 3;
    }
}

export type { ConwayStrategy };
export { defaultConwayStrategy };