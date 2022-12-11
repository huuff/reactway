import tuple from "immutable-tuple";
import { fakeConwayStrategy } from "../util/testing";
import { MapGrid } from "./map-grid";

describe("MapGrid", () => {

    test("height and width are correct", () => {
        const grid = MapGrid.create({
            height: 5,
            width: 5,
            birthFactor: 0,
            seed: "SEED",
        });

        expect(grid.height).toBe(5);
        expect(grid.width).toBe(5);
    });

    test("correctly ticks and gets", () => {
        // ARRANGE
        const grid = MapGrid.create({
            height: 5,
            width: 5,
            birthFactor: 0,
            seed: "SEED",
        });

        // ACT
        const nextStepGrid = grid.tick(fakeConwayStrategy([tuple(2, 3), tuple(2, 1), tuple(3, 2), tuple(3,3), tuple(4, 2)]));

        // ASSERT
        expect(nextStepGrid.get(tuple(2, 2))).toBe(false);
        expect(nextStepGrid.get(tuple(2, 1))).toBe(true);
        expect(nextStepGrid.get(tuple(2, 3))).toBe(true);
        expect(nextStepGrid.get(tuple(3, 2))).toBe(true);
    });

    test("toggle", () => {
        // ARRANGE
        const [toggledX, toggledY] = [2, 2];
        const initialGrid = MapGrid.create({
            height: 5,
            width: 5,
            birthFactor: 0,
            seed: "SEED",
        });

        // SANITY CHECK
        expect(initialGrid.get(tuple(toggledX, toggledY))).toBe(false);

        // ACT
        const toggledGrid = initialGrid.toggle(tuple(toggledX, toggledY));

        // ASSERT
        expect(toggledGrid.get(tuple(toggledX, toggledY))).toBe(true);
        for (const { coordinates: [x, y] } of toggledGrid) {
            if (x !== toggledX || y !== toggledY) {
                expect(toggledGrid.get(tuple(x, y))).toBe(initialGrid.get(tuple(x, y)));
            }
        }
        
    });

});