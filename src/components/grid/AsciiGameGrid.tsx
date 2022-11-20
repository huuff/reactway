
import { Grid } from "../../grid/grid";
import { Fragment } from "react";

type GameGridProps = {
    grid: Grid
} & { className: string };

const AsciiGameGrid = ({ grid, className }: GameGridProps) => (
    <div className={`${className} font-mono leading-none text-lg`}>
        {[...Array(grid.height)].map((_, y) => (
            <Fragment key={`row-${y}`}>
                {
                    [...Array(grid.width)].map((_, x) => (
                        <span key={`${x}-${y}`}>{grid.get(x, y) ? "X" : "O"}</span>
                    ))
                }
                <br key={`row-break-${y}`} />
            </Fragment>
        ))}
    </div>
)

export default AsciiGameGrid;