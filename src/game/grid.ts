type Coordinates = Readonly<[x: number, y: number]>;

type Grid = {
    readonly height: number;
    readonly width: number;

    get(x: number, y: number): boolean;
    set(x: number, y: number, state: boolean): void;
}

export type { Coordinates, Grid };