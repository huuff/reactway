import { useState } from "react";
import { ArrayGrid } from "../game/array-grid";
import { GridHook, UseGridHook } from "../game/grid-hook";

// TODO: Put it in the array-grid.ts file
const useArrayGrid: UseGridHook<ArrayGrid> 
    = (height: number, width: number, birthFactor: number): GridHook<ArrayGrid> => {
    return useState(ArrayGrid.create(height, width, birthFactor));
}

export default useArrayGrid;