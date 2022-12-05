import tuple from "immutable-tuple";
import { SetGrid } from "../grid/set-grid";
import { createGridFromAscii } from "./create-grid-from-ascii";

describe("createGridFromAscii", () => {

    test("block", () => {
        // ARRANGE
        const ascii = 
        `OOOO
         O##O
         O##O
         OOOO
        `;
        const expectedGrid = new SetGrid([
            tuple(1,1), tuple(2,1),
            tuple(1,2), tuple(2,2),
        ], 4, 4)

        // ACT
        const grid = createGridFromAscii(ascii);

        // ASSERT
        expect(grid.equals(expectedGrid)).toBe(true);

    });
});