
import { Grid } from "../../grid/grid";
import { Fragment } from "react";
import coordinatesToString from "../../util/coordinates-to-string";

type GameGridProps = {
    grid: Grid
} & { className?: string};

const AsciiGameGrid = ({ grid, className }: GameGridProps) => (
    <div className={`${className || ""} font-mono leading-none text-lg`}>
        {[...Array(grid.height)].map((_, y) => (
            <Fragment key={`row-${y}`}>
                {
                    [...Array(grid.width)].map((_, x) => {
                        const coord = coordinatesToString([x, y]);
                        return (
                            <span key={coord} data-testid={coord}>
                                {grid.get(x, y) ? "X" : "O"}
                            </span>
                        );
                    })
                }
                <br key={`row-break-${y}`} />
            </Fragment>
        ))}
    </div>
)

export default AsciiGameGrid;