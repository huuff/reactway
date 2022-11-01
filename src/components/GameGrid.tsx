
import { useEffect, Fragment, useState } from "react";
import { ArrayGrid } from "../game/array-grid";
import { defaultConwayStrategy } from "../game/conway-strategy";
import { GameSettings } from "../game/settings";

type GameGridProps = {
    settings: GameSettings
}

// TODO: Should maybe be in a context
let tickTimer: ReturnType<typeof setInterval>
const tickDurationMs = 1000;
const GameGrid = (props: GameGridProps & { className: string }) => {
    const { height, width, birthFactor } = props.settings;

    // TODO: The grid should be moved to the parent
    const [grid, setGrid] = useState(ArrayGrid.create(height, width, birthFactor))

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

    useEffect(() => {
        setGrid(ArrayGrid.create(height, width, birthFactor))
    }, [ height, width, birthFactor ])

    return (
        <div className={`${props.className} font-mono leading-none text-lg`}>
            {[...Array(grid.height)].map((_, y) => (
                        <Fragment key={`row-${y}`}>
                            {
                                [...Array(grid.width)].map((_, x) => (
                                    <span key={`${x}-${y}`}>{ grid.get(x, y) ? "X" : "O" }</span>
                                ))
                            }
                            <br key={`row-break-${y}`}/>
                        </Fragment>
            ))}
        </div>
    )
}

export default GameGrid;