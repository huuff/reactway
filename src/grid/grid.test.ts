
import { Coordinates } from "./grid";
import { SetGrid } from "./set-grid";

// Test for the default methods of Grid
const grid = new SetGrid([[2, 3], [2, 1], [3, 2], [3,3], [4, 2]]);
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

  test("equals", () => {
    expect(new SetGrid([[1, 1], [2, 2], [3, 2], [2, 3]])
      .equals(new SetGrid([[1, 1], [2, 2], [3, 2], [2, 3]])))
      .toBe(true)
  });

  test("iterator", () => {
    // ARRANGE
    const grid = new SetGrid(new Set<Readonly<Coordinates>>([[0,0], [1,1]]), 2, 2)
    const iteratedCells: Coordinates[] = [];

    // ACT
    for (const { coordinates: [x, y], isAlive } of grid) {
        iteratedCells.push([x, y]);
        if ((x == 0 && y == 0) || ( x == 1 && y == 1)) {
          expect(isAlive).toBe(true);
        } else {
          expect(isAlive).toBe(false);
        }
    }

    // ASSERT
    expect(iteratedCells)
      .toEqual([ [0,0], [1,0], [0,1], [1,1]])

  });

});

export {};