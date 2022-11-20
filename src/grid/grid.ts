import { ConwayStrategy } from "../game/conway-strategy";

type GameGridProps = {
    grid: Grid
} & { className?: string};

type Coordinates = Readonly<[x: number, y: number]>;

type GridCreationSettings = {
    readonly height: number;
    readonly width: number;
    readonly birthFactor: number;
    readonly seed: string;
}

type CreateGrid = (settings: GridCreationSettings) => Grid;

abstract class Grid {
    abstract readonly height: number;
    abstract readonly width: number;

    abstract get(x: number, y: number): boolean;
    abstract tick(strategy: ConwayStrategy): Grid;

    contains(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x <= (this.width - 1) && y <= (this.height - 1);
    }
    
    getNeighbours(x: number, y: number): Coordinates[] {
        return [
            [x-1, y] as const,
            [x, y+1] as const,
            [x+1, y] as const,
            [x, y-1] as const,
        ].filter((it) => this.contains(...it))
    }
    
    liveNeighbours(x: number, y: number): number {
        const boolToInt = (b: boolean): number => b ? 1 : 0;
        return this.getNeighbours(x, y)
            .map((it) => boolToInt(this.get(...it)))
            .reduce((acc, it) => acc + it, 0)
    }    
}

export { Grid }
export type { Coordinates, GridCreationSettings, CreateGrid, GameGridProps, };