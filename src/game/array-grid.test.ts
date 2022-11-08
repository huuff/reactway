import { ArrayGrid } from "./array-grid";

test("returns correct neighbours", () => {
  // ARRANGE
  const grid = ArrayGrid.create({
    height: 5,
    width: 5,
    birthFactor: 10,
  }, "SEED")
  
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
