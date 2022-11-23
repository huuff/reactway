import AsciiGameGrid from "./AsciiGameGrid";
import { render, screen } from "@testing-library/react";
import { coordinatesToString } from "../../util/coordinates-to-string";
import { Coordinates } from "../../grid/grid";
import { TupleGrid } from "../../grid/tuple-grid";

const liveCells: Coordinates[] = [[2, 3], [2, 1], [3, 2], [3,3], [4, 2]];
describe("AsciiGameGrid", () => {
    test("live cells are X", () => {
        render(<AsciiGameGrid grid={new TupleGrid(liveCells)} toggleCell={jest.fn()} />);

        for (const coord of liveCells) {
            expect(screen.getByTestId(coordinatesToString(coord))).toHaveTextContent("X");
        }
    });

    test("dead cells are O", () => {
        render(<AsciiGameGrid grid={new TupleGrid(liveCells)} toggleCell={jest.fn()} />);

        expect(screen.getByTestId(coordinatesToString([2, 2]))).toHaveTextContent("O");
    });
})