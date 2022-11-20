import { FakeGrid  } from "../util/testing";
import { defaultConwayStrategy } from "./conway-strategy";

const grid = new FakeGrid(5, 5);
describe("defaultConwayStrategy", () => {

    test("cell is born", () => {
        expect(defaultConwayStrategy(grid, [2, 2])).toBe(true);
    });

    test("cell dies by underpopulation", () => {
        expect(defaultConwayStrategy(grid, [3, 2])).toBe(false);
    });

    test("cell is kept alive", () => {
        expect(defaultConwayStrategy(grid, [3, 3])).toBe(true);
    });
});