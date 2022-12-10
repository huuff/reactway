import { ConwayStrategy } from "../game/conway-strategy";
import { Grid, GridCreationSettings, CreateGrid, Coordinates } from "./grid";
import seedrandom from "seedrandom";
import { shouldBeBornAlive } from "../util/birth-function";
import { ReadonlyDeep } from "type-fest";
import tuple from "immutable-tuple";

type InternalGrid = boolean[][];

class ArrayGrid extends Grid {
    private readonly internalGrid: ReadonlyDeep<InternalGrid>;

    public readonly type = "array";

    public readonly height: number;
    public readonly width: number;


    private constructor(internalGrid: InternalGrid, width: number, height: number) {
        super();
        this.internalGrid = internalGrid;
        this.height = height;
        this.width = width;
    }

    static create: CreateGrid = (settings: GridCreationSettings): ArrayGrid => {
        const random = seedrandom(settings.seed);
        return new ArrayGrid([...Array(settings.height + 2)].map((_, y) =>
            [...Array(settings.width + 2)].map((_, x) => {
                if (x === 0 || x === settings.width + 1 || y === 0 || y === settings.height + 1) {
                    return false;
                } else {
                    return shouldBeBornAlive(random, settings.birthFactor);
                }
            })
        ), settings.width, settings.height);
    };


    get = (coordinates: Coordinates): boolean => {
        if (!this.contains(coordinates)) {
            return false;
        } else {
            const [x, y] = coordinates;
            return this.internalGrid[y + 1][x + 1];
        }
    };

    liveNeighbours = ([x, y]: Coordinates): number => {
        if (x === 0 || y === 0 || x >= this.width || y >= this.height) {
            return 0;
        }

        const [actualX, actualY] = [x + 1, y + 1];

        let result = 0;
        if (this.internalGrid[actualY - 1][actualX - 1]) result++;
        if (this.internalGrid[actualY - 1][actualX]) result++;
        if (this.internalGrid[actualY - 1][actualX + 1]) result++;
        if (this.internalGrid[actualY][actualX - 1]) result++;
        if (this.internalGrid[actualY][actualX + 1]) result++;
        if (this.internalGrid[actualY + 1][actualX - 1]) result++;
        if (this.internalGrid[actualY + 1][actualX]) result++;
        if (this.internalGrid[actualY + 1][actualX + 1]) result++;
        return result;
    }

    tick = (strategy: ConwayStrategy): ArrayGrid => {
        const newInternalGrid = this.internalGrid.map((_, y) =>
            this.internalGrid[y].map((_, x) => {
                if (x === 0 || y === 0) {
                    return false;
                } else if (x === this.width + 1 || y === this.height + 1) {
                    return false;
                } else {
                    return strategy(this, tuple(x - 1, y - 1));
                }
            })
        )

        return new ArrayGrid(newInternalGrid, this.width, this.height);
    };

    toggle = ([x, y]: Coordinates): ArrayGrid => {
        const [actualX, actualY] = [x + 1, y + 1];
        const newInternalGrid = this.internalGrid.map((_, y_2) =>
            this.internalGrid[y].map((_, x_2) => !(actualX === x_2 && actualY === y_2)
                ? this.internalGrid[y_2][x_2]
                : !this.internalGrid[y_2][x_2]
            )
        )

        return new ArrayGrid(newInternalGrid, this.width, this.height);
    };
}

export { ArrayGrid };