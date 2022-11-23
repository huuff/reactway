import _ from "lodash";
import seedrandom from "seedrandom";
import { ConwayStrategy } from "../game/conway-strategy";
import { shouldBeBornAlive } from "../util/birth-function";
import { Coordinates, CreateGrid, Grid, GridCreationSettings, GridType } from "./grid";
import { iterateCoordinates } from "./iterate-coordinates";

// TODO: Make it available in settings
class TupleGrid extends Grid {
    private readonly tuples: Readonly<Coordinates[]>;

    public readonly type: GridType = "tuple";
    public readonly height: number;
    public readonly width: number;

    constructor(
        tuples: Coordinates[],
        height?: number,
        width?: number,
    ) {
        super()
        this.height = height ?? (_(tuples).map(([_, y]) => y).max() ?? 0) + 1;
        this.width = width ?? (_(tuples).map(([x, _]) => x).max() ?? 0) + 1;
        this.tuples = tuples;
    }

    static create: CreateGrid = ({
        height,
        width,
        birthFactor,
        seed,
    }: GridCreationSettings): TupleGrid => {
        const random = seedrandom(seed);
        const tuples: Coordinates[] = [];

        iterateCoordinates(height, width, ([x, y]) => {
            if (shouldBeBornAlive(random, birthFactor)) {
                tuples.push([x, y]);
            }
        })

        return new TupleGrid(tuples, height, width );
    }

    get(x: number, y: number): boolean {
        return this.tuples.some(([x_1, y_1]) => x === x_1 && y === y_1);
    }

    tick(strategy: ConwayStrategy): TupleGrid {
        const nextTuples: Coordinates[] = [];

        this.iterateCoordinates((coordinates) => {
            if (strategy(this, coordinates)) {
                nextTuples.push(coordinates)
            }
        })

        return new TupleGrid(nextTuples, this.height, this.width);
    }
    toggle(x: number, y: number): TupleGrid {
        if (this.get(x, y)) {
            return new TupleGrid(
                this.tuples.filter(([x_1, y_1]) => x != x_1 || y != y_1),
                this.height,
                this.width);
        } else {
            return new TupleGrid(
                [...this.tuples, [x, y]],
                this.height,
                this.width,
            )
        }
    }
}

export { TupleGrid };