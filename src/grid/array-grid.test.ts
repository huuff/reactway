import { fakeConwayStrategy } from "../util/testing";
import { ArrayGrid } from "./array-grid";

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
        const grid = ArrayGrid.create({
            height: 5,
            width: 5,
            birthFactor: 0,
            seed: "SEED",
        })

        // ACT
        const nextStepGrid = grid.tick(fakeConwayStrategy);

        // ASSERT
        expect(nextStepGrid.get(2, 2)).toBe(false);
        expect(nextStepGrid.get(2, 1)).toBe(true);
        expect(nextStepGrid.get(2, 3)).toBe(true);
        expect(nextStepGrid.get(3, 2)).toBe(true);
    })

})