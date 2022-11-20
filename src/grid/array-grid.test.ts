import { ConwayStrategy } from "../game/conway-strategy";
import { Grid } from "./grid";

class FakeGrid extends Grid<FakeGrid> {
  constructor(
    readonly height: number,
    readonly width: number,
    get: (x: number, y: number) => boolean = jest.fn()
  ) {
    super();
    this.get = get;
  }

  //get: (x: number, y: number) => boolean
  tick: (strategy: ConwayStrategy) => FakeGrid = jest.fn();
}

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
