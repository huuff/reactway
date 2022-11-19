import seedrandom from "seedrandom";
import { ConwayStrategy } from "../game/conway-strategy";
import { Coordinates, Grid, GridCreationSettings } from "./grid";
import { range } from "lodash";
import { shouldBeBornAlive } from "../game/birth-function";
import wu from "wu";


function createInternalGrid(settings: GridCreationSettings): Map<Coordinates, boolean> {
    const random = seedrandom(settings.seed);
    const internalGrid = new Map<Coordinates, boolean>();

    for (const y of range(0, settings.height - 1)) {
        for (const x of range(0, settings.width - 1)) {
            internalGrid.set([x, y], shouldBeBornAlive(random, settings.birthFactor))
        }
    }

    return internalGrid;
}

class MapGrid extends Grid<MapGrid> {
    private readonly internalGrid: Readonly<Map<Coordinates, boolean>>

    public readonly height: number;
    public readonly width: number;

    private constructor(internalGrid: Map<Coordinates, boolean>) {
        super();
        this.internalGrid = internalGrid;
        this.height = wu(internalGrid.keys())
            .map(([_, y]) => y)
            .reduce(Math.max, 0);
        this.width = wu(internalGrid.keys())
            .map(([x, _]) => x)
            .reduce(Math.max, 0);
    }

    static create(settings: GridCreationSettings): MapGrid {
        return new MapGrid(createInternalGrid(settings));
    }

    get(x: number, y: number): boolean {
        return this.internalGrid.get([x, y])!;
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

}

export { MapGrid };