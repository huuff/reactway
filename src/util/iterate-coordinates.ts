import { range } from "lodash";
import { Coordinates } from "../grid/grid";

function iterateCoordinates(
    height: number,
    width: number, 
    f: (coordinates: Coordinates) => void,
) {
    for (const y of range(0, height)) {
        for (const x of range(0, width)) {
            f([x, y]);
        }
    }
}

export { iterateCoordinates };