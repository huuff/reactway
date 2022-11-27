
import { GameGridProps } from "../../grid/grid";
import { Fragment, useMemo } from "react";
import { coordinatesToString } from "../../util/coordinates-to-string";

const AsciiGameGrid = ({ grid, className, toggleCell, cellSize }: GameGridProps) => {
    const sizeClass = useMemo(() => {
        switch (cellSize) {
            case 1: 
                return "text-xs";
            case 2:
                return "text-sm";
            case 3:
                return "text-base";
            case 4:
                return "text-lg";
            default:
                return "text-xl";
        }
    }, [cellSize]);

    return (
        <div className={`${className || ""} font-mono leading-none ${sizeClass}`}>
            {[...Array(grid.height)].map((_, y) => (
                <Fragment key={`row-${y}`}>
                    {
                        [...Array(grid.width)].map((_, x) => {
                            const coord = coordinatesToString([x, y]);
                            return (
                                <span
                                    key={coord}
                                    data-testid={coord}
                                    className="mx-1 hover:bg-red-400"
                                    onClick={() => toggleCell([x, y])}
                                >
                                    {grid.get(x, y) ? "X" : "O"}
                                </span>
                            );
                        })
                    }
                    <br key={`row-break-${y}`} />
                </Fragment>
            ))}
        </div>
    );
}

export default AsciiGameGrid;