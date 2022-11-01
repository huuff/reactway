import { useState } from "react";
import { Grid } from "../game/grid";


const useGrid = (height: number, width: number, birthFactor: number): Grid => {
    const [ grid, setGrid ] = useState([...Array(height)].map((_) => 
        [...Array(width)].map((_) => Math.random() < birthFactor ? true : false)
    ))

    const get = (x: number, y: number): boolean => grid[y][x]
    const set = (x: number, y: number, state: boolean): void => {
        setGrid(grid.map((_, y_2) => 
            grid[y_2].map((_, x_2) => x === x_2 && y === y_2 ? state : grid[y][x])
        ))
    }

    return { height, width, get, set }
}

export default useGrid;