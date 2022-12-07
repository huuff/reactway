
import { GameGridProps } from "../../grid/grid";
import { Fragment, useMemo } from "react";
import { coordinatesToString } from "../../util/coordinates-to-string";
import tuple from "immutable-tuple";
import { useDarkMode } from "usehooks-ts";
import classNames from "classnames";
import { getTheme } from "../../util/get-theme";

const AsciiGameGrid = ({ grid, className, toggleCell, cellSize }: GameGridProps) => {
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

    return (
        <div className={`${className || ""} font-mono leading-none ${sizeClass}`}>
            {[...Array(grid.height)].map((_, y) => (
                <Fragment key={`row-${y}`}>
                    {
                        [...Array(grid.width)].map((_, x) => {
                            const coordinate = tuple(x, y)
                            const coordinateString = coordinatesToString(coordinate);
                            const isAlive = grid.get(tuple(x, y));
                            return (
                                <span
                                    key={coordinateString}
                                    data-testid={coordinateString}
                                    className={
                                        classNames(
                                            "mx-1",
                                            `hover:bg-${theme.cell.hovered[isAlive ? "alive" : "dead"].className}`,
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