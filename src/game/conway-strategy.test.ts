import { SetGrid } from "../grid/set-grid";
import { defaultConwayStrategy } from "./conway-strategy";
import tuple from "immutable-tuple";

const grid = new SetGrid([tuple(2, 3), tuple(2, 1), tuple(3, 2), tuple(3,3), tuple(4, 2)]);
describe("defaultConwayStrategy", () => {

    test("cell is born", () => {
        expect(defaultConwayStrategy(grid, tuple(4, 3))).toBe(true);
    });

    test("cell dies by underpopulation", () => {
        expect(defaultConwayStrategy(grid, tuple(2, 1))).toBe(false);
    });

    test("cell is kept alive", () => {
        expect(defaultConwayStrategy(grid, tuple(3, 3))).toBe(true);
    });
});