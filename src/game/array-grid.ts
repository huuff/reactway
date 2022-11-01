import { ConwayStrategy } from "./conway-strategy";
import { Grid } from "./grid";

type InternalGrid = boolean[][];

class ArrayGrid extends Grid<ArrayGrid> {
    private readonly internalGrid: InternalGrid; // TODO: DeepReadonly

    public readonly height: number;
    public readonly width: number;


    private constructor(internalGrid: InternalGrid) {
        super();
        this.internalGrid = internalGrid;
        this.height = internalGrid.length;
        this.width = internalGrid[0]?.length ?? 0;
    }

    // TODO: Extract `birthFactor` logic somewhere else
    static create(
        height: number,
        width: number,
        birthFactor: number,
    ): ArrayGrid {
        return new ArrayGrid([...Array(height)].map((_) =>
            [...Array(width)].map((_) => Math.random() < birthFactor ? true : false)
        ));
    }


    get(x: number, y: number): boolean {
        return this.internalGrid[y][x];
    }

    tick(strategy: ConwayStrategy): ArrayGrid {
        const newInternalGrid = this.internalGrid.map((_, y) => 
            this.internalGrid[y].map((_, x) => strategy(this, [x, y]))
        )

        return new ArrayGrid(newInternalGrid);
    }
}

export { ArrayGrid };