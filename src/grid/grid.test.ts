
import tuple from "immutable-tuple";
import { Coordinates } from "./grid";
import { SetGrid } from "./set-grid";

// Test for the default methods of Grid
const grid = new SetGrid([tuple(2, 3), tuple(2, 1), tuple(3, 2), tuple(3,3), tuple(4, 2)]);
describe("Grid", () => {
  describe("contains", () => {
    test("true", () => {
      expect(grid.contains(tuple(2, 2))).toBe(true);
    });

    test("false", () => {
      expect(grid.contains(tuple(10, 10))).toBe(false);
    })

  });

  test("liveNeighbours", () => {
    expect(grid.liveNeighbours(tuple(2, 2))).toBe(4);
  })

  test("equals", () => {
    expect(new SetGrid([tuple(1, 1), tuple(2, 2), tuple(3, 2), tuple(2, 3)])
      .equals(new SetGrid([tuple(1, 1), tuple(2, 2), tuple(3, 2), tuple(2, 3)])))
      .toBe(true)
  });

  test("iterator", () => {
    // ARRANGE
    const grid = new SetGrid(new Set<Readonly<Coordinates>>([tuple(0,0), tuple(1,1)]), 2, 2)
    const iteratedCells: Coordinates[] = [];

    // ACT
    for (const { coordinates: [x, y], isAlive } of grid) {
        iteratedCells.push(tuple(x, y));
        if ((x == 0 && y == 0) || ( x == 1 && y == 1)) {
          expect(isAlive).toBe(true);
        } else {
          expect(isAlive).toBe(false);
        }
    }

    // ASSERT
    expect(iteratedCells)
      .toEqual([tuple(0,0), tuple(1,0), tuple(0,1), tuple(1,1)])

  });

});

export {};