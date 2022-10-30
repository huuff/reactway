import { useState } from "react";

type Grid = {
    get(x: number, y: number): boolean;
    toggle(x: number, y: number): void;
    kill(x: number, y:number): void;
    revive(x: number, y: number): void;
}

const useGrid = (height: number, width: number, birthFactor: number): Grid => {
    const [ grid, setGrid ] = useState([...Array(height)].map((_) => 
        [...Array(width)].map((_) => Math.random() < birthFactor ? true : false)
    ))

    const get = (x: number, y: number): boolean => grid[y][x]
    // TODO: All of these are wrong because they don't use setGrid
    const toggle = (x: number, y: number): void => {
        grid[y][x] = !grid[y][x];
    }
    const kill = (x: number, y: number): void => {
        grid[y][x] = false;
    }
    const revive = (x: number, y: number): void => {
        grid[y][x] = true;
    }

    return { get, toggle, kill, revive }
}

export default useGrid;