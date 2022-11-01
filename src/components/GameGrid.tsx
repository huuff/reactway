
import React, { useEffect } from "react";
import { defaultConwayStrategy } from "../game/conway-strategy";
import { GameSettings } from "../game/settings";
import useArrayGrid from "../hooks/use-array-grid";
import Cell from "./Cell";

type GameGridProps = {
    settings: GameSettings
}

// TODO: Should maybe be in a context
let tickTimer: ReturnType<typeof setInterval>
const tickDurationMs = 1000;
const GameGrid = (props: GameGridProps & { className: string }) => {
    const { height, width, birthFactor } = props.settings;

    const [grid, setGrid] = useArrayGrid(height, width, birthFactor)

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
        <div className={`${props.className} font-mono leading-none text-lg`}>
            {[...Array(height)].map((_, y) => (
                <>
                    {
                        [...Array(width)].map((_, x) => (
                                <Cell
                                    isAlive={grid.get(x, y)}
                                    aliveElement={<span>X</span>}
                                    deadElement={<span>O</span>}
                                />
                        ))
                    }
                    <br/>
                </>
            ))}
        </div>
    )
}

export default GameGrid