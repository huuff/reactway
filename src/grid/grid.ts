import { range } from "lodash";
import { ConwayStrategy } from "../game/conway-strategy";
import { iterateCoordinates } from "../util/iterate-coordinates";
import { GridStateWrapper } from "../game/use-grid";

type GameGridProps = {
    grid: Grid,
    toggleCell: GridStateWrapper["toggleCell"],
} & { className?: string };

type Coordinates = Readonly<[x: number, y: number]>;

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

    abstract get(x: number, y: number): boolean;
    abstract tick(strategy: ConwayStrategy): Grid;
    abstract toggle(x: number, y: number): Grid;

    contains(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x <= (this.width - 1) && y <= (this.height - 1);
    }

    getNeighbours(x: number, y: number): Coordinates[] {
        return [
            [x - 1, y] as const,
            [x, y + 1] as const,
            [x + 1, y] as const,
            [x, y - 1] as const,
            [x-1, y+1] as const,
            [x-1, y-1] as const,
            [x+1, y+1] as const,
            [x+1, y-1] as const,
        ].filter((it) => this.contains(...it))
    }

    liveNeighbours(x: number, y: number): number {
        const boolToInt = (b: boolean): number => b ? 1 : 0;
        return this.getNeighbours(x, y)
            .map((it) => boolToInt(this.get(...it)))
            .reduce((acc, it) => acc + it, 0)
    }

    iterateCoordinates(f: (coordinates: Coordinates) => void): void {
        iterateCoordinates(this.height, this.width, f);
    }

    *[Symbol.iterator](): IterableIterator<Cell> {
        for (const y of range(0, this.height)) {
            for (const x of range(0, this.width)) {
                yield {
                    coordinates: [x, y ],
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