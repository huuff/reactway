
import { GameGridProps } from "../../grid/grid";
import classNames from "classnames";
import { coordinatesToString } from "../../util/coordinates-to-string";
import { useMemo } from "react";
import tuple from "immutable-tuple";

const CELL_SIZE_MULTIPLIER = 2;

const TableGameGrid = ({ grid, className, toggleCell, cellSize }: GameGridProps) => {
    const sizeClasses = useMemo(() => classNames(
        `h-${cellSize * CELL_SIZE_MULTIPLIER}`,
        `w-${cellSize * CELL_SIZE_MULTIPLIER}`
    ), [cellSize]);

    return (
        <table className={`${className || ""} w-72 table-fixed`}>
            <tbody>
                {[...Array(grid.height)].map((_, y) => (
                    <tr key={`row-${y}`}>
                        {
                            [...Array(grid.width)].map((_, x) => {
                                const coord = coordinatesToString(tuple(x, y));
                                return (
                                    <td
                                        key={coord}
                                        data-testid={coord}
                                        onClick={() => toggleCell(tuple(x, y))}
                                        className={classNames(
                                            sizeClasses,
                                            "border",
                                            {
                                                "bg-black": grid.get(x, y),
                                                "bg-white": !grid.get(x, y),
                                                "hover:bg-red-800": grid.get(x, y),
                                                "hover:bg-red-400": !grid.get(x, y),
                                            })}>
                                    </td>
                                )
                            })
                        }
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default TableGameGrid;