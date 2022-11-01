import { useState } from "react";
import { ArrayGrid } from "../game/array-grid";
import { GridHook, UseGridHook } from "../game/grid-hook";


const useArrayGrid: UseGridHook<ArrayGrid> 
    = (height: number, width: number, birthFactor: number): GridHook<ArrayGrid> => {
    return useState(new ArrayGrid(height, width, birthFactor));
}

export default useArrayGrid;