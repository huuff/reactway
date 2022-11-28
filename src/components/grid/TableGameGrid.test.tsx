import TableGameGrid from "./TableGameGrid";
import { render, screen } from "@testing-library/react";
import { SetGrid } from "../../grid/set-grid";
import { coordinatesToString } from "../../util/coordinates-to-string";
import { Coordinates } from "../../grid/grid";
import renderer from "react-test-renderer";

const liveCells: Coordinates[] = [[2, 3], [2, 1], [3, 2], [3,3], [4, 2]];
describe("TableGameGrid", () => {
    test("live cells are X", () => {
        render(<TableGameGrid grid={new SetGrid(liveCells)} toggleCell={jest.fn()} cellSize={3}/>);

        for (const coord of liveCells) {
            expect(screen.getByTestId(coordinatesToString(coord))).toHaveClass("bg-black");
        }
    });

    test("dead cells are O", () => {
        render(<TableGameGrid grid={new SetGrid(liveCells)} toggleCell={jest.fn()} cellSize={3}/>);

        expect(screen.getByTestId(coordinatesToString([2, 2]))).toHaveClass("bg-white");
    });

    test("snapshot", () => {
        expect(renderer.create(
            <TableGameGrid grid={new SetGrid(liveCells)} toggleCell={jest.fn()} cellSize={3}/>
        ).toJSON()).toMatchSnapshot();
    });
})