import { SetGrid } from "../grid/set-grid";
import { defaultConwayStrategy } from "./conway-strategy";

const grid = new SetGrid([[2, 3], [2, 1], [3, 2], [3,3], [4, 2]]);
describe("defaultConwayStrategy", () => {

    test("cell is born", () => {
        expect(defaultConwayStrategy(grid, [4, 3])).toBe(true);
    });

    test("cell dies by underpopulation", () => {
        expect(defaultConwayStrategy(grid, [2, 1])).toBe(false);
    });

    test("cell is kept alive", () => {
        expect(defaultConwayStrategy(grid, [3, 3])).toBe(true);
    });
});