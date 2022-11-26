import { ConwayStrategy } from "../game/conway-strategy";
import { Coordinates, Grid } from "../grid/grid";
import { coordinatesToString }from "./coordinates-to-string";


function fakeConwayStrategy(nextLiveCells: Coordinates[]): ConwayStrategy {
  return (grid: Grid, coordinates: Coordinates) => {
    const stringCoordinates = coordinatesToString(coordinates);
    return nextLiveCells.some(
      liveCoordinates => stringCoordinates == coordinatesToString(liveCoordinates)
      );
  }
}

export { fakeConwayStrategy };