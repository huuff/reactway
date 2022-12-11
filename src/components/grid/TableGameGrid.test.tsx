import TableGameGrid from "./TableGameGrid";
import { render, screen } from "@testing-library/react";
import { SetGrid } from "../../grid/set-grid";
import { coordinatesToString } from "../../util/coordinates-to-string";
import { Coordinates } from "../../grid/grid";
import renderer from "react-test-renderer";
import tuple from "immutable-tuple";
import theme from "../../../theme";

jest.mock("usehooks-ts", () => ({
    ...jest.requireActual("usehooks-ts"),
    useDarkMode: jest.fn(() => ({
      isDarkMode: false,
    }))
  }));

  // TODO: Test toggling?
const liveCells: Coordinates[] = [tuple(2, 3), tuple(2, 1), tuple(3, 2), tuple(3,3), tuple(4, 2)];
describe("TableGameGrid", () => {
    test("live cells have the alive color", () => {
        render(<TableGameGrid grid={new SetGrid(liveCells)} toggleCell={jest.fn()} cellSize={3}/>);

        for (const coord of liveCells) {
            expect(screen.getByTestId(coordinatesToString(coord))).toHaveClass(`bg-${theme.light.cell.alive.className}`);
        }
    });

    test("dead cells have the dead color", () => {
        render(<TableGameGrid grid={new SetGrid(liveCells)} toggleCell={jest.fn()} cellSize={3}/>);

        expect(screen.getByTestId(coordinatesToString(tuple(2, 2)))).toHaveClass(`bg-${theme.light.cell.dead.className}`);
    });

    test("snapshot", () => {
        expect(renderer.create(
            <TableGameGrid grid={new SetGrid(liveCells)} toggleCell={jest.fn()} cellSize={3}/>
        ).toJSON()).toMatchSnapshot();
    });
});