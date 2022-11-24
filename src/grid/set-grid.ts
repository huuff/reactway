import _ from "lodash";
import seedrandom from "seedrandom";
import wu from "wu";
import { ConwayStrategy } from "../game/conway-strategy";
import { shouldBeBornAlive } from "../util/birth-function";
import { coordinatesToString, stringToCoordinates } from "../util/coordinates-to-string";
import { Coordinates, CreateGrid, Grid, GridCreationSettings, GridType } from "./grid";
import { iterateCoordinates } from "../util/iterate-coordinates";

class SetGrid extends Grid {
     // Holds serialized coordinates so as to have decent equality semantics
    private readonly set: Readonly<Set<string>>;

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
        this.set = new Set(actualTuples.map(coordinatesToString));
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
                tuples.push([x, y]);
            }
        })

        return new SetGrid(tuples, height, width );
    }

    get(x: number, y: number): boolean {
        return this.set.has(coordinatesToString([x, y]));
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
            newSet.delete(coordinatesToString([x, y]));
        } else {
            newSet.add(coordinatesToString([x ,y]));
        }

        return new SetGrid(
            wu(newSet.values()).map(stringToCoordinates).toArray(),
            this.height,
            this.width,
        )
    }
}

export { SetGrid };