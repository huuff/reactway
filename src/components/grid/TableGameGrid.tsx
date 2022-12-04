
import { GameGridProps } from "../../grid/grid";
import classNames from "classnames";
import { coordinatesToString } from "../../util/coordinates-to-string";
import { useMemo } from "react";
import tuple from "immutable-tuple";
import { useDarkMode } from "usehooks-ts";

const CELL_SIZE_MULTIPLIER = 2;

const TableGameGrid = ({ grid, className, toggleCell, cellSize }: GameGridProps) => {
    const { isDarkMode } = useDarkMode();
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
                                const coordinates = tuple(x, y)
                                const coordinatesString = coordinatesToString(coordinates);
                                const isAlive = grid.get(coordinates);
                                return (
                                    <td
                                        key={coordinatesString}
                                        data-testid={coordinatesString}
                                        onClick={() => toggleCell(coordinates)}
                                        className={classNames(
                                            sizeClasses,
                                            "border",
                                            {
                                                "bg-black": !isDarkMode && isAlive,
                                                "bg-white": !isDarkMode && !isAlive,
                                                "bg-slate-400": isDarkMode && isAlive,
                                                "bg-slate-800" : isDarkMode && !isAlive,
                                                "hover:bg-red-800": isAlive,
                                                "hover:bg-red-400": !isAlive,
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