import tuple from "immutable-tuple";
import { fakeConwayStrategy } from "../util/testing";
import { ArrayGrid } from "./array-grid";
import { MapGrid } from "./map-grid";
import { SetGrid } from "./set-grid";

describe.each([
    SetGrid.create,
    ArrayGrid.create,
    MapGrid.create
])("Grid implementations", (createGrid) => {
    const grid = createGrid({
        height: 5,
        width: 5,
        birthFactor: 0,
        seed: "SEED",
    });

    test("height and width are correct", () => {
        expect(grid.height).toBe(5);
        expect(grid.width).toBe(5);
    });

    test("correctly ticks and gets", () => {
        // ARRANGE
        const conwayStrategy = fakeConwayStrategy([tuple(2, 3), tuple(2, 1), tuple(3, 2), tuple(3,3), tuple(4, 2)]);

        // ACT
        const nextStepGrid = grid.tick(conwayStrategy);

        // ASSERT
        expect(nextStepGrid.get(tuple(2, 2))).toBe(false);
        expect(nextStepGrid.get(tuple(2, 1))).toBe(true);
        expect(nextStepGrid.get(tuple(2, 3))).toBe(true);
        expect(nextStepGrid.get(tuple(3, 2))).toBe(true);
    });


    test("toggle", () => {
        // ARRANGE
        const [toggledX, toggledY] = [2, 2];

        // SANITY CHECK
        expect(grid.get(tuple(toggledX, toggledY))).toBe(false);

        // ACT
        const toggledGrid = grid.toggle(tuple(toggledX, toggledY));

        // ASSERT
        expect(toggledGrid.get(tuple(toggledX, toggledY))).toBe(true);
        for (const { coordinates: [x, y] } of toggledGrid) {
            if (x !== toggledX || y !== toggledY) {
                expect(toggledGrid.get(tuple(x, y))).toBe(grid.get(tuple(x, y)));
            }
        }
        
    });

    test("population", () => {
        // ARRANGE
        // First, we turn some cells on (so there's some population to speak of)
        const resultingGrid = grid.toggle(tuple(1, 1))
                                  .toggle(tuple(1, 0))
                                  .toggle(tuple(2, 2))
                                  ;

        // ACT & ASSERT
        console.log(`Population: ${resultingGrid.population}`);
        console.log(`Grid type: ${resultingGrid.type}`);
        expect(resultingGrid.population).toBe(3);
    });

});