import seedrandom from "seedrandom";
import { ConwayStrategy } from "../game/conway-strategy";
import { Grid, GridCreationSettings, CreateGrid, Coordinates } from "./grid";
import { range } from "lodash";
import { shouldBeBornAlive } from "../util/birth-function";
import wu from "wu";
import tuple from "immutable-tuple";


function createInternalGrid(settings: GridCreationSettings): Map<Coordinates, boolean> {
    const random = seedrandom(settings.seed);
    const internalGrid = new Map<Coordinates, boolean>();

    for (const y of range(0, settings.height)) {
        for (const x of range(0, settings.width)) {
            const alive = shouldBeBornAlive(random, settings.birthFactor);
            internalGrid.set(tuple(x, y), alive);
        }
    }

    return internalGrid;
}

class MapGrid extends Grid {
    private readonly internalGrid: Readonly<Map<Coordinates, boolean>>

    public readonly type = "map";

    public readonly height: number;
    public readonly width: number;

    private constructor(internalGrid: Map<Coordinates, boolean>) {
        super();
        this.internalGrid = internalGrid;
        this.height = wu(internalGrid.keys())
            .map(([_, y]) => y)
            .reduce(Math.max, 0) + 1;
        this.width = wu(internalGrid.keys())
            .map(([x, _]) => x)
            .reduce(Math.max, 0) + 1;
    }

    static create: CreateGrid = (settings: GridCreationSettings): MapGrid => {
        return new MapGrid(createInternalGrid(settings));
    }

    get(x: number, y: number): boolean {
        return this.internalGrid.get(tuple(x, y))!;
    }
    tick(strategy: ConwayStrategy): MapGrid {
        // New grid with birthFactor 0, so it's empty
        const newGrid = createInternalGrid({
            height: this.height,
            width: this.width,
            seed: "",
            birthFactor: 0,
        })

        for (const coordinates of this.internalGrid.keys()) {
            newGrid.set(coordinates, strategy(this, coordinates))
        }

        return new MapGrid(newGrid);
    }

    toggle(x: number, y: number): MapGrid {
        const targetCoordinates = tuple(x, y);
        const newInternalGrid = new Map<Coordinates, boolean>();

        for (const coordinates of this.internalGrid.keys()) {
            if (coordinates !== targetCoordinates) {
                newInternalGrid.set(coordinates, this.internalGrid.get(coordinates)!)
            } else {
                newInternalGrid.set(coordinates, !this.internalGrid.get(coordinates))
            }
        }

        return new MapGrid(newInternalGrid);
    }

}

export { MapGrid };