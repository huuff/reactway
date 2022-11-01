import { useState } from "react";
import { Grid } from "../game/grid";


const useGrid = (height: number, width: number, birthFactor: number): Grid => {
    const [ grid, setGrid ] = useState([...Array(height)].map((_) => 
        [...Array(width)].map((_) => Math.random() < birthFactor ? true : false)
    ))

    const get = (x: number, y: number): boolean => grid[y][x]
    const toggle = (x: number, y: number): void => {
        setGrid(grid.map((_, y_2) => 
            grid[y_2].map((_, x_2) => x === x_2 && y === y_2 ? !grid[y][x] : grid[y][x])
        ))
    }
    const kill = (x: number, y: number): void => {
        setGrid(grid.map((_, y_2) => 
            grid[y_2].map((_, x_2) => x === x_2 && y === y_2 ? false : grid[y][x])
        ))
    }
    const revive = (x: number, y: number): void => {
        setGrid(grid.map((_, y_2) => 
            grid[y_2].map((_, x_2) => x === x_2 && y === y_2 ? true : grid[y][x])
        ))
    }

    return { get, toggle, kill, revive }
}

export default useGrid;