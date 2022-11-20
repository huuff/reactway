import { FakeGrid  } from "../testing/fake-grid";
import { defaultConwayStrategy } from "./conway-strategy";

describe("defaultConwayStrategy", () => {

    test("cell rebirths", () => {
        // ARRANGE
        const grid = new FakeGrid(5, 5);

        // ACT & ASSERT
        expect(defaultConwayStrategy(grid, [2, 2])).toBe(true);
    })
})