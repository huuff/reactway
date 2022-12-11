import tuple from "immutable-tuple";
import { Coordinates } from "../grid/grid";
import { iterateCoordinates } from "./iterate-coordinates";


test("iterateCoordinates", () => {
    // ARRANGE
    const iteratedCoordinates: Coordinates[] = [];

    // ACT
    iterateCoordinates(2, 2, (coordinates) => {
        iteratedCoordinates.push(coordinates);
    });

    // ASSERT
    expect(iteratedCoordinates)
        .toEqual([
            tuple(0, 0), tuple(1, 0), tuple(0, 1), tuple(1, 1),
        ]);
});