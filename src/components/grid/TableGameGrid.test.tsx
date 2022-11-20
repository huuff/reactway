import TableGameGrid from "./TableGameGrid";
import { render, screen } from "@testing-library/react";
import { FakeGrid, liveCellsInFakeGrid } from "../../util/testing";
import coordinatesToString from "../../util/coordinates-to-string";

describe("TableGameGrid", () => {
    test("live cells are X", () => {
        render(<TableGameGrid grid={new FakeGrid(5, 5)} />);

        for (const coord of liveCellsInFakeGrid) {
            expect(screen.getByTestId(coordinatesToString(coord))).toHaveClass("bg-black");
        }
    });

    test("dead cells are O", () => {
        render(<TableGameGrid grid={new FakeGrid(5, 5)} />);

        expect(screen.getByTestId(coordinatesToString([2, 2]))).toHaveClass("bg-white");
    });
})