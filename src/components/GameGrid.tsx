
import { useEffect } from "react";
import { defaultConwayStrategy } from "../game/conway-strategy";
import useArrayGrid from "../hooks/use-array-grid";
import Cell from "./Cell";

type GameGridProps = {
    height: number;
    width: number;
    birthFactor: number;
}

let tickTimer: ReturnType<typeof setInterval>
const tickDurationMs = 1000;
const GameGrid = (props: GameGridProps) => {
    const [ grid, setGrid ] = useArrayGrid(props.height, props.width, props.birthFactor)

    useEffect(() => {
        tickTimer = setInterval(() => {
            setGrid(grid.tick(defaultConwayStrategy))
        }, tickDurationMs)
    })

    useEffect(() => {
        return () => {
            clearInterval(tickTimer);
        }
    })

    return (
        <div>
            { [...Array(props.height)].map((_, y) => (
                [...Array(props.width)].map((_, x) => (
                    x < (props.width-1) 
                    ? <Cell 
                        isAlive={grid.get(x, y)} 
                        aliveElement={<span>X</span>} 
                        deadElement={<span>O</span>} 
                      />
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