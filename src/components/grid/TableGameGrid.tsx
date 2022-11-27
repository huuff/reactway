
import { GameGridProps } from "../../grid/grid";
import classNames from "classnames";
import { coordinatesToString } from "../../util/coordinates-to-string";

const TableGameGrid = ({ grid, className, toggleCell }: GameGridProps) => (
    <table className={`${className || ""} w-72 table-fixed`}>
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
                                    onClick={() => toggleCell([x, y])}
                                    className={classNames(
                                        "w-6",
                                        "h-6",
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

export default TableGameGrid;