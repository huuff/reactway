import { ConwayStrategy } from "../game/conway-strategy";
import { Coordinates, Grid } from "../grid/grid";
import { coordinatesToString }from "./coordinates-to-string";

const liveCells: readonly [x: number, y: number][] = [
  [2, 3], [2, 1], [3, 2], [3,3], [4, 2]
];

function fakeConwayStrategy(nextLiveCells: Coordinates[]): ConwayStrategy {
  return (grid: Grid, coordinates: Coordinates) => {
    const stringCoordinates = coordinatesToString(coordinates);
    return nextLiveCells.some(
      liveCoordinates => stringCoordinates == coordinatesToString(liveCoordinates)
      );
  }
}

export { fakeConwayStrategy };