import max from "lodash/max";
import seedrandom from "seedrandom";
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
    public readonly population: number;

    constructor(tuples: Set<Coordinates>, height?: number, width?: number, population?: number)
    constructor(tuples: Coordinates[], height?: number, width?: number, population?: number)
    constructor(
        tuples: Coordinates[] | Set<Coordinates>,
        height?: number,
        width?: number,
        population?: number,
    ) {
        super();
        let actualTuples: Coordinates[];
        if (tuples instanceof Set) {
            actualTuples = Array.from(tuples.values());
        } else {
            actualTuples = tuples;
        }
        this.height = height ?? (max(actualTuples.map(([_, y]) => y)) ?? 0) + 1;
        this.width = width ?? (max(actualTuples.map(([x, _]) => x)) ?? 0) + 1;
        this.set = new Set(actualTuples);
        this.population = population ?? actualTuples.length;
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
        });

        return new SetGrid(tuples, height, width );
    };

    get(coordinates: Coordinates): boolean {
        const result = this.set.has(coordinates);
        return result;
    }

    tick(strategy: ConwayStrategy): SetGrid {
        const nextTuples: Coordinates[] = [];

        this.iterateCoordinates((coordinates) => {
            if (strategy(this, coordinates)) {
                nextTuples.push(coordinates);
            }
        });

        return new SetGrid(nextTuples, this.height, this.width, nextTuples.length);
    }
    toggle(coordinates: Coordinates): SetGrid {
        const newSet = new Set(this.set);
        if (this.get(coordinates)) {
            newSet.delete(coordinates);
        } else {
            newSet.add(coordinates);
        }

        return new SetGrid(
            newSet,
            this.height,
            this.width,
        );
    }
}

export { SetGrid };