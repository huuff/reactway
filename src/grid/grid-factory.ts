import { ArrayGrid } from "./array-grid";
import { CreateGrid, GridType } from "./grid";
import { MapGrid } from "./map-grid";
import { SetGrid } from "./set-grid";

function getGridFactory(type: GridType): CreateGrid {
    switch (type) {
        case "array":
            return ArrayGrid.create;
        case "map":
            return MapGrid.create;
        case "set":
            return SetGrid.create;
    }
}

export { getGridFactory };