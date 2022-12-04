import { fakeConwayStrategy } from "../util/testing";
import { ArrayGrid } from "./array-grid";
import tuple from "immutable-tuple";

describe("ArrayGrid", () => {

    test("height and width are correct", () => {
        const grid = ArrayGrid.create({
            height: 5,
            width: 5,
            birthFactor: 0,
            seed: "SEED",
        });

        expect(grid.height).toBe(5)
        expect(grid.width).toBe(5)
    });

    test("correctly ticks and gets", () => {
        // ARRANGE
        const conwayStrategy = fakeConwayStrategy([tuple(2, 3), tuple(2, 1), tuple(3, 2), tuple(3,3), tuple(4, 2)]);
        const grid = ArrayGrid.create({
            height: 5,
            width: 5,
            birthFactor: 0,
            seed: "SEED",
        })

        // ACT
        const nextStepGrid = grid.tick(conwayStrategy);

        // ASSERT
        expect(nextStepGrid.get(2, 2)).toBe(false);
        expect(nextStepGrid.get(2, 1)).toBe(true);
        expect(nextStepGrid.get(2, 3)).toBe(true);
        expect(nextStepGrid.get(3, 2)).toBe(true);
    });


    test("toggle", () => {
        // ARRANGE
        const [toggledX, toggledY] = [2, 2];
        const initialGrid = ArrayGrid.create({
            height: 5,
            width: 5,
            birthFactor: 0,
            seed: "SEED",
        });

        // SANITY CHECK
        expect(initialGrid.get(toggledX, toggledY)).toBe(false);

        // ACT
        const toggledGrid = initialGrid.toggle(toggledX, toggledY);

        // ASSERT
        expect(toggledGrid.get(toggledX, toggledY)).toBe(true);
        for (const { coordinates: [x, y] } of toggledGrid) {
            if (x !== toggledX || y !== toggledY) {
                expect(toggledGrid.get(x, y)).toBe(initialGrid.get(x, y));
            }
        }
        
    });

})