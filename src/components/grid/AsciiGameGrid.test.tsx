import AsciiGameGrid from "./AsciiGameGrid";
import { fireEvent, render, screen } from "@testing-library/react";
import { coordinatesToString } from "../../util/coordinates-to-string";
import { Coordinates } from "../../grid/grid";
import { SetGrid } from "../../grid/set-grid";
import renderer from "react-test-renderer";
import tuple from "immutable-tuple";

jest.mock("usehooks-ts", () => ({
    ...jest.requireActual("usehooks-ts"),
    useDarkMode: jest.fn(() => ({
      isDarkMode: false,
    }))
  }));

const liveCells: Coordinates[] = [tuple(2, 3), tuple(2, 1), tuple(3, 2), tuple(3,3), tuple(4, 2)];
describe("AsciiGameGrid", () => {
    test("live cells are X", () => {
        render(<AsciiGameGrid grid={new SetGrid(liveCells)} toggleCell={jest.fn()} cellSize={3}/>);

        for (const coord of liveCells) {
            expect(screen.getByTestId(coordinatesToString(coord))).toHaveTextContent("X");
        }
    });

    test("dead cells are O", () => {
        render(<AsciiGameGrid grid={new SetGrid(liveCells)} toggleCell={jest.fn()} cellSize={3}/>);

        expect(screen.getByTestId(coordinatesToString(tuple(2, 2)))).toHaveTextContent("O");
    });

    test("clicking on a cell toggles it", () => {
        // ARRANGE
        const toggle = jest.fn();
        render(<AsciiGameGrid grid={new SetGrid(liveCells)} toggleCell={toggle} cellSize={3}/>);
        const targetTuple = tuple(2, 2);

        // ACT
        fireEvent.click(screen.getByTestId(coordinatesToString(targetTuple)), { bubbles: true});

        // ASSERT
        expect(toggle).toHaveBeenCalledWith(targetTuple);
    });

    test("snapshot", () => {
        expect(renderer.create(
            <AsciiGameGrid grid={new SetGrid(liveCells)} toggleCell={jest.fn()} cellSize={3} />
        ).toJSON()).toMatchSnapshot();
    });
});