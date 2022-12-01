import { range } from "lodash";
import { ConwayStrategy } from "../game/conway-strategy";
import { iterateCoordinates } from "../util/iterate-coordinates";
import { GridStateWrapper } from "../game/use-grid";
import { Box2D } from "../util/box-2d";
import tuple, {Tuple} from "immutable-tuple";

type GameGridProps = {
    grid: Grid,
    toggleCell: GridStateWrapper["toggleCell"],
    cellSize: number,
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

// TODO: Should I make all functions arrows just in case?
abstract class Grid {
    abstract readonly type: GridType;
    abstract readonly height: number;
    abstract readonly width: number;

    abstract get(x: number, y: number): boolean;
    abstract tick(strategy: ConwayStrategy): Grid;
    abstract toggle(x: number, y: number): Grid;

    contains(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x <= (this.width - 1) && y <= (this.height - 1);
    }

    liveNeighbours(x: number, y: number): number {
        let result = 0;
        if (this.get(x-1, y-1)) result++;
        if (this.get(x-1, y)) result++;
        if (this.get(x-1, y+1)) result++;
        if (this.get(x, y-1)) result++;
        if (this.get(x, y+1)) result ++;
        if (this.get(x+1, y-1)) result++;
        if (this.get(x+1, y)) result++;
        if (this.get(x+1, y+1)) result++;

        return result;
    }

    iterateCoordinates(f: (coordinates: Coordinates) => void): void {
        iterateCoordinates(this.height, this.width, f);
    }

    // TODO: Use the bounded iterator for this
    *[Symbol.iterator](): IterableIterator<Cell> {
        for (const y of range(0, this.height)) {
            for (const x of range(0, this.width)) {
                yield {
                    coordinates: tuple(x, y),
                    isAlive: this.get(x, y),
                }
            }
        }
    }

    *boundedIterator(bounds: Box2D): IterableIterator<Cell> {
        const [ minX, minY ] = bounds.topLeft;
        const [ maxX, maxY ] = bounds.bottomRight;

        for (const y of range(minY, maxY+1)) {
            for (const x of range(minX, maxX+1)) {
                yield {
                    coordinates: tuple(x, y),
                    isAlive: this.get(x, y),
                }
            }
        }
    }

    equals(other: Grid): boolean {
        for (const {coordinates: [x, y], isAlive} of this) {
                if (isAlive != other.get(x, y)) {
                    return false;
                }
        }

        return true;
    }
}

type Cell = {
    readonly coordinates: Coordinates;
    readonly isAlive: boolean;
}

export { Grid }
export type { Coordinates, GridCreationSettings, CreateGrid, GameGridProps, GridType };