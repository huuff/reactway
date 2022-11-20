import { ConwayStrategy } from "../game/conway-strategy";
import { Grid } from "../grid/grid";

class FakeGrid extends Grid<FakeGrid> {
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

  tick: (strategy: ConwayStrategy) => FakeGrid = jest.fn();
}

export { FakeGrid };