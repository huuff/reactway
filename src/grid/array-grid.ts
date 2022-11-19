import { ConwayStrategy } from "../game/conway-strategy";
import { Grid, GridCreationSettings, CreateGrid } from "./grid";
import seedrandom from "seedrandom";
import { shouldBeBornAlive } from "../util/birth-function";
import { ReadonlyDeep } from "type-fest";

type InternalGrid = boolean[][];

class ArrayGrid extends Grid<ArrayGrid> {
    private readonly internalGrid: ReadonlyDeep<InternalGrid>;

    public readonly height: number;
    public readonly width: number;


    private constructor(internalGrid: InternalGrid) {
        super();
        this.internalGrid = internalGrid;
        this.height = internalGrid.length;
        this.width = internalGrid[0]?.length ?? 0;
    }

    static create: CreateGrid = (settings: GridCreationSettings): ArrayGrid  => {
        const random = seedrandom(settings.seed);
        return new ArrayGrid([...Array(settings.height)].map((_) =>
            [...Array(settings.width)].map((_) => shouldBeBornAlive(random, settings.birthFactor))
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