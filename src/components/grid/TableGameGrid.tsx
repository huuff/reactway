
import { Grid } from "../../grid/grid";
import classNames from "classnames";
import coordinatesToString from "../../util/coordinates-to-string";

type GameGridProps = {
    grid: Grid
} & { className?: string };

const TableGameGrid = ({ grid, className }: GameGridProps) => (
    <table className={`${className || ""}`}>
        <tbody>
            {[...Array(grid.height)].map((_, y) => (
                <tr key={`row-${y}`}>
                    {
                        [...Array(grid.width)].map((_, x) => {
                            const coord = coordinatesToString([x, y]);
                            return (
                                <td
                                    key={coord}
                                    data-testid={coord}
                                    className={classNames("w-6", "h-6", "border", {
                                        "bg-black": grid.get(x, y),
                                        "bg-white": !grid.get(x, y),
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

export default TableGameGrid;