import { FakeGrid } from "../testing/fake-grid";

describe("Grid", () => {
  test("neighbours", () => {
    // ARRANGE
    const grid = new FakeGrid(5, 5);

    // ACT
    const neighbours = grid.getNeighbours(2, 2);

    // ASSERT
    // sorting to ignore order
    expect(neighbours.sort()).toEqual([
      [1, 2],
      [3, 2],
      [2, 1],
      [2, 3],
    ].sort());
  });

  describe("contains", () => {
    test("true", () => {
      // ARRANGE
      const grid = new FakeGrid(5, 5);

      // ACT & ASSERT
      expect(grid.contains(2, 2)).toBe(true);
    });

    test("false", () => {
      // ARRANGE
      const grid = new FakeGrid(5, 5);

      // ACT & ASSERT
      expect(grid.contains(10, 10)).toBe(false);
    })

  });

  test("liveNeighbours", () => {
    // ARRANGE
    const grid = new FakeGrid(5, 5);

    // ACT & ASSERT
    expect(grid.liveNeighbours(2, 2)).toBe(3);

  })

});

export {};