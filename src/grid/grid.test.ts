import { FakeGrid } from "../util/testing";

// Test for the default methods of Grid
const grid = new FakeGrid(5, 5);
describe("Grid", () => {
  test("neighbours", () => {
    // ACT
    const neighbours = grid.getNeighbours(2, 2);

    // ASSERT
    // sorting to ignore order
    expect(neighbours.sort()).toEqual([
      [1, 2],
      [3, 2],
      [2, 1],
      [2, 3],
      [1, 3],
      [1, 1],
      [3, 3],
      [3, 1],
    ].sort());
  });

  describe("contains", () => {
    test("true", () => {
      expect(grid.contains(2, 2)).toBe(true);
    });

    test("false", () => {
      expect(grid.contains(10, 10)).toBe(false);
    })

  });

  test("liveNeighbours", () => {
    expect(grid.liveNeighbours(2, 2)).toBe(4);

  })

});

export {};