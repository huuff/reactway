import { ConwayStrategy } from "../game/conway-strategy";
import { Grid } from "../grid/grid";
import { coordinatesToString }from "./coordinates-to-string";

const liveCells: readonly [x: number, y: number][] = [
  [2, 3], [2, 1], [3, 2], [3,3], [4, 2]
];
class FakeGrid extends Grid {
  // TODO: Why not hardcode the parameters? I always use the same
  public readonly type = "fake";

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

  toggle(x: number, y: number): Grid {
    throw new Error("Method not implemented.");
  }
}

const fakeConwayStrategy: ConwayStrategy = (grid: Grid, coordinates: readonly [number, number]) => {
  const stringCoordinates = coordinatesToString(coordinates);
  return liveCells.some(liveCoordinates => stringCoordinates == coordinatesToString(liveCoordinates));
}

export { FakeGrid, fakeConwayStrategy, liveCells as liveCellsInFakeGrid };