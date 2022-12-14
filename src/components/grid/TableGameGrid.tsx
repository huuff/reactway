
import { GameGridProps } from "../../grid/grid";
import classNames from "classnames";
import { coordinatesToString } from "../../util/coordinates-to-string";
import { useContext, useMemo } from "react";
import tuple from "immutable-tuple";
import { useDarkMode }  from "usehooks-ts";
import { getTheme } from "../../util/get-theme";
import { PerformanceTrackerContext } from "../../hooks/use-performance-tracker";

const CELL_SIZE_MULTIPLIER = 2;

const TableGameGrid = ({ grid, className, toggleCell, cellSize, innerRef }: GameGridProps) => {
    const { isDarkMode } = useDarkMode();
    const sizeClasses = useMemo(() => classNames(
        `h-${cellSize * CELL_SIZE_MULTIPLIER}`,
        `w-${cellSize * CELL_SIZE_MULTIPLIER}`
    ), [cellSize]);
    const theme = useMemo(() => getTheme(isDarkMode), [isDarkMode]);

    const performanceTracker = useContext(PerformanceTrackerContext);

    return (
        <div ref={innerRef}>
            <table className={`${className || ""} w-72 table-fixed`}>
                <tbody>
                    {[...Array(grid.height)].map((_, y) => (
                        <tr key={`row-${y}`}>
                            {
                                [...Array(grid.width)].map((_, x) => {
                                    const coordinates = tuple(x, y);
                                    const coordinatesString = coordinatesToString(coordinates);
                                    const isAlive = grid.get(coordinates);
                                    const color = theme.cell[isAlive ? "alive" : "dead"].className;
                                    const hoverClass = `hover:bg-${theme.cell.hovered[isAlive ? "alive" : "dead"].className}`;
                                    return (
                                        <td
                                            key={coordinatesString}
                                            data-testid={coordinatesString}
                                            onClick={() => toggleCell(coordinates)}
                                            className={classNames(
                                                sizeClasses,
                                                "border",
                                                `bg-${color}`,
                                                {[hoverClass]: !performanceTracker.isDisabled("hover")},
                                            )}>
                                        </td>
                                    );
                                })
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableGameGrid;