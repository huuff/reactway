import range from "lodash/range";
import { ConwayStrategy } from "../game/conway-strategy";
import { iterateCoordinates } from "../util/iterate-coordinates";
import { GridStateWrapper } from "../game/use-grid";
import { Box2D } from "../util/box-2d";
import tuple, {Tuple} from "immutable-tuple";

type GameGridProps = {
    grid: Grid,
    toggleCell: GridStateWrapper["toggleCell"],
    cellSize: number,
    innerRef?: (node: HTMLDivElement | null) => void,
} & { className?: string };

type Coordinates = Tuple;

type GridCreationSettings = {
    readonly height: number;
    readonly width: number;
    readonly birthFactor: number;
    readonly seed: string;
}

type CreateGrid = (settings: GridCreationSettings) => Grid;

type GridType = "array" | "map" | "set";

abstract class Grid {
    abstract readonly type: GridType;
    abstract readonly height: number;
    abstract readonly width: number;
    /**
     * Gives the number of cells that are currently alive
     */
    // TODO: Test it
    abstract readonly population: number;

    /**
     * Returns the state of the cell at the passed-in coordinates:
     * - true: alive
     * - false: dead
     * @param coordinates 
     */
    abstract get(coordinates: Coordinates): boolean;

    /**
     * Returns the next iteration of the game of life according to the given strategy
     * @param strategy 
     */
    abstract tick(strategy: ConwayStrategy): Grid;

    /**
     * Switches the state of the cell at the given coordinates: from alive to dead and
     * from dead to alive
     * @param coordinates 
     */
    abstract toggle(coordinates: Coordinates): Grid;

    contains = ([x, y]: Coordinates): boolean => {
        return x >= 0 && y >= 0 && x <= (this.width - 1) && y <= (this.height - 1);
    };

    liveNeighbours = ([x, y]: Coordinates): number => {
        let result = 0;
        if (this.get(tuple(x-1, y-1))) result++;
        if (this.get(tuple(x-1, y))) result++;
        if (this.get(tuple(x-1, y+1))) result++;
        if (this.get(tuple(x, y-1))) result++;
        if (this.get(tuple(x, y+1))) result ++;
        if (this.get(tuple(x+1, y-1))) result++;
        if (this.get(tuple(x+1, y))) result++;
        if (this.get(tuple(x+1, y+1))) result++;

        return result;
    };

    iterateCoordinates = (f: (coordinates: Coordinates) => void): void =>{
        iterateCoordinates(this.height, this.width, f);
    };

    *[Symbol.iterator](): IterableIterator<Cell> {
        for (const cell of this.boundedIterator(new Box2D(tuple(0,0), tuple(this.width-1, this.height-1)))) {
            yield cell;
        }
    }

    *boundedIterator(bounds: Box2D): IterableIterator<Cell> {
        const [ minX, minY ] = bounds.topLeft;
        const [ maxX, maxY ] = bounds.bottomRight;

        for (const y of range(minY, maxY+1)) {
            for (const x of range(minX, maxX+1)) {
                yield {
                    coordinates: tuple(x, y),
                    isAlive: this.get(tuple(x, y)),
                };
            }
        }
    }

    equals = (other: Grid): boolean  => {
        if (this.height !== other.height || this.width !== other.width) {
            return false;
        }

        for (const {coordinates: [x, y], isAlive} of this) {
                if (isAlive != other.get(tuple(x, y))) {
                    return false;
                }
        }

        return true;
    };
}

type Cell = {
    readonly coordinates: Coordinates;
    readonly isAlive: boolean;
}

export { Grid };
export type { Coordinates, GridCreationSettings, CreateGrid, GameGridProps, GridType };