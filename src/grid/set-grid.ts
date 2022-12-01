import _ from "lodash";
import seedrandom from "seedrandom";
import wu from "wu";
import { ConwayStrategy } from "../game/conway-strategy";
import { shouldBeBornAlive } from "../util/birth-function";
import { Coordinates, CreateGrid, Grid, GridCreationSettings, GridType } from "./grid";
import { iterateCoordinates } from "../util/iterate-coordinates";
import tuple from "immutable-tuple";

class SetGrid extends Grid {
     // Holds serialized coordinates so as to have decent equality semantics
    private readonly set: Readonly<Set<Coordinates>>;

    public readonly type: GridType = "set";
    public readonly height: number;
    public readonly width: number;

    constructor(tuples: Set<Coordinates>, height?: number, width?: number)
    constructor(tuples: Coordinates[], height?: number, width?: number)
    constructor(
        tuples: Coordinates[] | Set<Coordinates>,
        height?: number,
        width?: number,
    ) {
        super()
        let actualTuples: Coordinates[];
        if (tuples instanceof Set) {
            actualTuples = wu(tuples.values()).toArray();
        } else {
            actualTuples = tuples;
        }
        this.height = height ?? (_(actualTuples).map(([_, y]) => y).max() ?? 0) + 1;
        this.width = width ?? (_(actualTuples).map(([x, _]) => x).max() ?? 0) + 1;
        this.set = new Set(actualTuples);
    }

    static create: CreateGrid = ({
        height,
        width,
        birthFactor,
        seed,
    }: GridCreationSettings): SetGrid => {
        const random = seedrandom(seed);
        const tuples: Coordinates[] = [];

        iterateCoordinates(height, width, ([x, y]) => {
            if (shouldBeBornAlive(random, birthFactor)) {
                tuples.push(tuple(x, y));
            }
        })

        return new SetGrid(tuples, height, width );
    }

    get(x: number, y: number): boolean {
        const result = this.set.has(tuple(x, y));
        return result;
    }

    tick(strategy: ConwayStrategy): SetGrid {
        const nextTuples: Coordinates[] = [];

        this.iterateCoordinates((coordinates) => {
            if (strategy(this, coordinates)) {
                nextTuples.push(coordinates)
            }
        })

        return new SetGrid(nextTuples, this.height, this.width);
    }
    toggle(x: number, y: number): SetGrid {
        const newSet = new Set(this.set);
        if (this.get(x, y)) {
            newSet.delete(tuple(x, y));
        } else {
            newSet.add(tuple(x, y));
        }

        return new SetGrid(
            newSet,
            this.height,
            this.width,
        )
    }
}

export { SetGrid };