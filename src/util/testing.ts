import { ConwayStrategy } from "../game/conway-strategy";
import { Grid } from "../grid/grid";
import coordinatesToString from "./coordinates-to-string";

const liveCells: readonly [x: number, y: number][] = [
  [2, 3], [2, 1], [3, 2], [3,3]
];
class FakeGrid extends Grid {
  constructor(
    readonly height: number,
    readonly width: number,
  ) {
    super();
  }

  get(x: number, y: number): boolean {
    const coordinates = coordinatesToString([x, y]);
    return liveCells.some(liveCoordinates => coordinates == coordinatesToString(liveCoordinates));
  }

  tick: (strategy: ConwayStrategy) => this = jest.fn();
}

const fakeConwayStrategy: ConwayStrategy = (grid: Grid, coordinates: readonly [number, number]) => {
  const stringCoordinates = coordinatesToString(coordinates);
  return liveCells.some(liveCoordinates => stringCoordinates == coordinatesToString(liveCoordinates));
}

export { FakeGrid, fakeConwayStrategy, liveCells as liveCellsInFakeGrid };