
import { Grid } from "../grid/grid";
import cx from "classnames";

type GameGridProps = {
    grid: Grid<any>
} & { className: string };

const TableGameGrid = ({ grid, className }: GameGridProps) => (
    <table className={`${className}`}>
        <tbody>
            {[...Array(grid.height)].map((_, y) => (
                <tr key={`row-${y}`}>
                    {
                        [...Array(grid.width)].map((_, x) => (
                            <td
                                key={`${x}-${y}`}
                                className={cx({
                                    "bg-black": grid.get(x, y),
                                    "bg-white": !grid.get(x, y),
                                    "w-6": true,
                                    "h-6": true,
                                    "border": true,
                                })}>
                            </td>
                        ))
                    }
                </tr>
            ))}
        </tbody>
    </table>
)

export default TableGameGrid;