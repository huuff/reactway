import { ConwayStrategy } from "../game/conway-strategy";
import { Grid } from "../grid/grid";

const liveCells = [
  [2, 3], [2, 1], [3, 2], [3,3]
].map(coord => JSON.stringify(coord));
class FakeGrid extends Grid {
  constructor(
    readonly height: number,
    readonly width: number,
  ) {
    super();
  }

  get(x: number, y: number): boolean {
    const coordinates = JSON.stringify([x, y]);
    return liveCells.some(liveCoordinates => coordinates == liveCoordinates);
  }

  tick: (strategy: ConwayStrategy) => this = jest.fn();
}

const fakeConwayStrategy: ConwayStrategy = (grid: Grid, coordinates: readonly [number, number]) => {
  const stringCoordinates = JSON.stringify(coordinates);
  return liveCells.some(liveCoordinates => liveCoordinates == stringCoordinates);
}

export { FakeGrid, fakeConwayStrategy, liveCells as liveCellsInFakeGrid };