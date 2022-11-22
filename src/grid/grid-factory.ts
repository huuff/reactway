import { ArrayGrid } from "./array-grid";
import { CreateGrid, GridType } from "./grid";
import { MapGrid } from "./map-grid";

function getGridFactory(type: GridType): CreateGrid {
    if (type === "array") {
        return ArrayGrid.create;
    } else if (type === "map") {
        return MapGrid.create;
    } else {
        throw Error(`Grid type ${type} not recognized`);
    }
}

export { getGridFactory };