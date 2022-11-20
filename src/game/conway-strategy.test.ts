import { FakeGrid  } from "../testing/fake-grid";
import { defaultConwayStrategy } from "./conway-strategy";

const grid = new FakeGrid(5, 5);
describe("defaultConwayStrategy", () => {

    test("cell rebirths", () => {
        expect(defaultConwayStrategy(grid, [2, 2])).toBe(true);
    });

    test("cell dies", () => {
        expect(defaultConwayStrategy(grid, [3, 2])).toBe(false);
    });

    test("cell is kept alive", () => {
        expect(defaultConwayStrategy(grid, [3, 3])).toBe(true);
    });
});