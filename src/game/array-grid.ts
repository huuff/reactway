import { Grid } from "./grid";

class ArrayGrid extends Grid {
    private readonly internalGrid: Readonly<Readonly<boolean[]>[]>

    // TODO: Extract `birthFactor` logic somewhere else
    constructor(
        public readonly height: number,
        public readonly width: number,
        birthFactor: number,
    ) {
        super()
        this.internalGrid = [...Array(height)].map((_) =>
            [...Array(width)].map((_) => Math.random() < birthFactor ? true : false)
        );
    }


    get(x: number, y: number): boolean {
        return this.internalGrid[y][x];
    }

}

export { ArrayGrid };