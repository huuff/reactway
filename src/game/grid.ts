type Grid = {
    get(x: number, y: number): boolean;
    set(x: number, y: number, state: boolean): void;
}

export type { Grid };