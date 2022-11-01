
import { Fragment } from "react";
import { Grid } from "../game/grid";

type GameGridProps = {
    grid: Grid<any>
}

const GameGrid = (props: GameGridProps & { className: string }) => {
    const { grid } = props;

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