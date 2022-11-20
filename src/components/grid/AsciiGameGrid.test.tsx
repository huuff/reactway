import AsciiGameGrid from "./AsciiGameGrid";
import { render, screen } from "@testing-library/react";
import { FakeGrid, liveCellsInFakeGrid } from "../../util/testing";
import coordinatesToString from "../../util/coordinates-to-string";

describe("AsciiGameGrid", () => {
    test("live cells are X", () => {
        render(<AsciiGameGrid grid={new FakeGrid(5, 5)} />);

        for (const coord of liveCellsInFakeGrid) {
            expect(screen.getByTestId(coordinatesToString(coord))).toHaveTextContent("X");
        }
    });

    test("dead cells are O", () => {
        render(<AsciiGameGrid grid={new FakeGrid(5, 5)} />);

        expect(screen.getByTestId(coordinatesToString([2, 2]))).toHaveTextContent("O");
    });
})