import seedrandom from "seedrandom";
import { ConwayStrategy } from "../game/conway-strategy";
import { Grid, GridCreationSettings, CreateGrid, Coordinates } from "./grid";
import range from "lodash/range";
import { shouldBeBornAlive } from "../util/birth-function";
import tuple from "immutable-tuple";


type InternalGridResult = {
    readonly internalGrid: Map<Coordinates, boolean>;
    readonly population: number;
};
function createInternalGrid(settings: GridCreationSettings): InternalGridResult {
    const random = seedrandom(settings.seed);
    const internalGrid = new Map<Coordinates, boolean>();

    let population = 0;
    for (const y of range(0, settings.height)) {
        for (const x of range(0, settings.width)) {
            const alive = shouldBeBornAlive(random, settings.birthFactor);
            if (alive) {
                population++;
            }
            internalGrid.set(tuple(x, y), alive);
        }
    }

    return { internalGrid, population };
}

class MapGrid extends Grid {
    private readonly internalGrid: Readonly<Map<Coordinates, boolean>>;

    public readonly type = "map";

    public readonly height: number;
    public readonly width: number;
    public readonly population: number;

    private constructor(
        internalGrid: Map<Coordinates, boolean>,
        height?: number,
        width?: number,
        population?: number,
    ) {
        super();
        this.internalGrid = internalGrid;
        this.height = height ?? Array.from(internalGrid.keys())
            .map(([_, y]) => y)
            .reduce((acc, n) => Math.max(acc, n), 0) + 1;
        this.width = width ?? Array.from(internalGrid.keys())
            .map(([x, _]) => x)
            .reduce((acc, n) => Math.max(acc, n), 0) + 1;
        this.population = population ?? (() => {
            let population = 0;
            for (const isAlive of internalGrid.values()) {
                isAlive && population++;
            }
            return population;
        })();
    }

    static create: CreateGrid = (settings: GridCreationSettings): MapGrid => {
        const { internalGrid, population } = createInternalGrid(settings);

        return new MapGrid(internalGrid, settings.height, settings.width, population );
    };

    get = (coordinates: Coordinates): boolean => {
        return this.internalGrid.get(coordinates)!;
    };
    tick = (strategy: ConwayStrategy): MapGrid => {
        // New grid with birthFactor 0, so it's empty
        const { internalGrid: newGrid } = createInternalGrid({
            height: this.height,
            width: this.width,
            seed: "",
            birthFactor: 0,
        });

        let newPopulation = 0;
        for (const coordinates of this.internalGrid.keys()) {
            const willBeAlive = strategy(this, coordinates);

            if (willBeAlive) {
                newPopulation++;
            }

            newGrid.set(coordinates, willBeAlive);
        }

        return new MapGrid(newGrid, this.height, this.width, newPopulation);
    };

    toggle = (targetCoordinates: Coordinates): MapGrid => {
        const newInternalGrid = new Map<Coordinates, boolean>();

        for (const coordinates of this.internalGrid.keys()) {
            if (coordinates !== targetCoordinates) {
                newInternalGrid.set(coordinates, this.internalGrid.get(coordinates)!);
            } else {
                newInternalGrid.set(coordinates, !this.internalGrid.get(coordinates));
            }
        }

        return new MapGrid(newInternalGrid);
    };

}

export { MapGrid };