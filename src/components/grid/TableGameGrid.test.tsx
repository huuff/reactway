import TableGameGrid from "./TableGameGrid";
import { render, screen } from "@testing-library/react";
import { TupleGrid } from "../../grid/tuple-grid";
import { coordinatesToString } from "../../util/coordinates-to-string";
import { Coordinates } from "../../grid/grid";

const liveCells: Coordinates[] = [[2, 3], [2, 1], [3, 2], [3,3], [4, 2]];
describe("TableGameGrid", () => {
    test("live cells are X", () => {
        render(<TableGameGrid grid={new TupleGrid(liveCells)} toggleCell={jest.fn()} />);

        for (const coord of liveCells) {
            expect(screen.getByTestId(coordinatesToString(coord))).toHaveClass("bg-black");
        }
    });

    test("dead cells are O", () => {
        render(<TableGameGrid grid={new TupleGrid(liveCells)} toggleCell={jest.fn()}/>);

        expect(screen.getByTestId(coordinatesToString([2, 2]))).toHaveClass("bg-white");
    });
})