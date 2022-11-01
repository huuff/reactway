type Grid = {
    get(x: number, y: number): boolean;
    toggle(x: number, y: number): void;
    kill(x: number, y:number): void;
    revive(x: number, y: number): void;
}

export type { Grid };