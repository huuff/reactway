import { ArrayGrid } from "./array-grid";
import { CreateGrid } from "./grid";
import { MapGrid } from "./map-grid";

type GridType = "array" | "map";

function getGridFactory(type: GridType): CreateGrid {
    if (type === "array") {
        return ArrayGrid.create;
    } else if (type === "map") {
        return MapGrid.create;
    } else {
        throw Error(`Grid type ${type} not recognized`);
    }
}

export type { GridType };
export { getGridFactory };