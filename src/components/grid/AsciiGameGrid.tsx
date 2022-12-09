
import { GameGridProps } from "../../grid/grid";
import { Fragment, useContext, useMemo } from "react";
import { coordinatesToString } from "../../util/coordinates-to-string";
import tuple from "immutable-tuple";
import { useDarkMode } from "usehooks-ts";
import classNames from "classnames";
import { getTheme } from "../../util/get-theme";
import { PerformanceTrackerContext } from "../../hooks/use-performance-tracker";

const AsciiGameGrid = ({ grid, className, toggleCell, cellSize, innerRef }: GameGridProps) => {
    const { isDarkMode } = useDarkMode();
    const theme = useMemo(() => getTheme(isDarkMode), [isDarkMode]);

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

    const performanceTracker = useContext(PerformanceTrackerContext);

    return (
        <div className={`${className || ""} font-mono leading-none ${sizeClass}`} ref={innerRef}>
            {[...Array(grid.height)].map((_, y) => (
                <Fragment key={`row-${y}`}>
                    {
                        [...Array(grid.width)].map((_, x) => {
                            const coordinate = tuple(x, y)
                            const coordinateString = coordinatesToString(coordinate);
                            const isAlive = grid.get(tuple(x, y));
                            // XXX: Using only the color for alive cells because the letter (X or O) already
                            // indicates wether it's alive or dead
                            const hoverClass = `hover:bg-${theme.cell.hovered.alive.className}`;
                            return (
                                <span
                                    key={coordinateString}
                                    data-testid={coordinateString}
                                    className={
                                        classNames(
                                            "mx-1",
                                            { [hoverClass]: !performanceTracker.isDisabled("hover") },
                                            `text-${theme.text.className}`,
                                        )
                                    }
                                    onClick={() => toggleCell(coordinate)}
                                >
                                    {isAlive ? "X" : "O"}
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