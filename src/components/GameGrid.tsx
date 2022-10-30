
import { useState } from "react";
import Cell from "./Cell";

type GameGridProps = {
    height: number;
    width: number;
    birthFactor: number;
}

const GameGrid = (props: GameGridProps) => {
    const [ grid, setGrid ] = useState([...Array(props.height)].map((_) => 
        [...Array(props.height)].map((_) => Math.random() < props.birthFactor ? true : false)
    ))

    return (
        <div>
            { grid.map((_, y) => (
                grid[y].map((_, x) => (
                    x < (props.width-1) 
                    ? <Cell isAlive={grid[y][x]} aliveElement={<span>X</span>} deadElement={<span>O</span>} />
                    : <br/>
                ))
            ))}
        </div>
    )
}

GameGrid.defaultProps = {
    height: 10,
    width: 10,
    birthFactor: 0.2,
}

export default GameGrid