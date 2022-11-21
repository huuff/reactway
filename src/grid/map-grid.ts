import seedrandom from "seedrandom";
import { ConwayStrategy } from "../game/conway-strategy";
import { Grid, GridCreationSettings, CreateGrid } from "./grid";
import { range } from "lodash";
import { shouldBeBornAlive } from "../util/birth-function";
import wu from "wu";
import { coordinatesToString, stringToCoordinates } from "../util/coordinates-to-string";


function createInternalGrid(settings: GridCreationSettings): Map<string, boolean> {
    const random = seedrandom(settings.seed);
    const internalGrid = new Map<string, boolean>();

    for (const y of range(0, settings.height)) {
        for (const x of range(0, settings.width)) {
            const alive = shouldBeBornAlive(random, settings.birthFactor);
            internalGrid.set(coordinatesToString([x, y]), alive);
        }
    }

    return internalGrid;
}

class MapGrid extends Grid {
    private readonly internalGrid: Readonly<Map<string, boolean>>

    public readonly height: number;
    public readonly width: number;

    private constructor(internalGrid: Map<string, boolean>) {
        super();
        this.internalGrid = internalGrid;
        this.height = wu(internalGrid.keys())
            .map(key => stringToCoordinates(key))
            .map(([_, y]) => y)
            .reduce(Math.max, 0) + 1;
        this.width = wu(internalGrid.keys())
            .map(key => stringToCoordinates(key))
            .map(([x, _]) => x)
            .reduce(Math.max, 0) + 1;
    }

    static create: CreateGrid = (settings: GridCreationSettings): MapGrid => {
        return new MapGrid(createInternalGrid(settings));
    }

    get(x: number, y: number): boolean {
        return this.internalGrid.get(coordinatesToString([x, y]))!;
    }
    tick(strategy: ConwayStrategy): MapGrid {
        // New grid with birthFactor 0, so it's empty
        // TODO: can't I just create a new map?
        const newGrid = createInternalGrid({
            height: this.height,
            width: this.width,
            seed: "",
            birthFactor: 0,
        })

        for (const coordinates of this.internalGrid.keys()) {
            newGrid.set(coordinates, strategy(this, stringToCoordinates(coordinates)))
        }

        return new MapGrid(newGrid);
    }

    // TODO: Test
    toggle(x: number, y: number): MapGrid {
        const targetCoordinatesAsString = coordinatesToString([x, y]);
        const newInternalGrid = new Map<string, boolean>();

        for (const coordinates of this.internalGrid.keys()) {
            if (coordinates !== targetCoordinatesAsString) {
                newInternalGrid.set(coordinates, this.internalGrid.get(coordinates)!)
            } else {
                newInternalGrid.set(coordinates, !this.internalGrid.get(coordinates))
            }
        }

        return new MapGrid(newInternalGrid);
    }

}

export { MapGrid };