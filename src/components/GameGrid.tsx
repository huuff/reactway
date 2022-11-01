
import { useEffect } from "react";
import { defaultConwayStrategy } from "../game/conway-strategy";
import { GameSettings } from "./Game";
import useArrayGrid from "../hooks/use-array-grid";
import Cell from "./Cell";



let tickTimer: ReturnType<typeof setInterval>
const tickDurationMs = 1000;
const GameGrid = (props: GameSettings) => {
    const [grid, setGrid] = useArrayGrid(props.height, props.width, props.birthFactor)

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
            {[...Array(props.height)].map((_, y) => (
                [...Array(props.width)].map((_, x) => (
                    x < (props.width - 1)
                        ? <Cell
                            isAlive={grid.get(x, y)}
                            aliveElement={<span>X</span>}
                            deadElement={<span>O</span>}
                        />
                        : <br />
                ))
            ))}
        </div>
    )
}

export default GameGrid