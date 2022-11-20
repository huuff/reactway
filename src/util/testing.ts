import { ConwayStrategy } from "../game/conway-strategy";
import { Grid } from "../grid/grid";

class FakeGrid extends Grid {
  constructor(
    readonly height: number,
    readonly width: number,
  ) {
    super();
  }

  get(x: number, y: number): boolean {
    // Live cells: (2, 3), (2, 1), (3, 2), (3, 3)
    // These are useful for tests
    return   (x === 2 && y === 3)
       || (x === 2 && y === 1)
       || (x === 3 && y === 2)
       || (x === 3 && y === 3)
       ;
  }

  tick: (strategy: ConwayStrategy) => this = jest.fn();
}

const fakeConwayStrategy: ConwayStrategy = (grid: Grid, [x, y]: readonly [number, number]) => {
  // Makes alive all cells around (2,2)
  return (x === 2 && y === 1)
      || (x === 2 && y === 3)
      || (x === 1 && y === 2)
      || (x === 3 && y === 2)
      ;
}

export { FakeGrid, fakeConwayStrategy };