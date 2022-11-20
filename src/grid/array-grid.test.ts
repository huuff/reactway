import { ConwayStrategy } from "../game/conway-strategy";
import { Grid } from "./grid";

class FakeGrid extends Grid<FakeGrid> {
  constructor(
    readonly height: number,
    readonly width: number,
  ) {
    super();
  }

  get(x: number, y: number): boolean {
    // Only the cell over (2,2) and the cell under it are alive, to test
    // liveNeighbours
    return (x === 2 && y === 3) || (x === 2 && y === 1)
  }

  tick: (strategy: ConwayStrategy) => FakeGrid = jest.fn();
}

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
    expect(grid.liveNeighbours(2, 2)).toBe(2);

  })

});