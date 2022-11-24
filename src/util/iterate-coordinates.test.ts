import { Coordinates } from "../grid/grid";
import { iterateCoordinates } from "./iterate-coordinates";


test("iterateCoordinates", () => {
    // ARRANGE
    const iteratedCoordinates: Coordinates[] = [];

    // ACT
    iterateCoordinates(2, 2, (coordinates) => {
        iteratedCoordinates.push(coordinates);
    })

    // ASSERT
    expect(iteratedCoordinates)
        .toEqual([
            [0, 0], [1, 0], [0, 1], [1, 1],
        ])
});