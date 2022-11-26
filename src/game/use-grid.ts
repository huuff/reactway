import { useReducer } from "react";
import { Coordinates, Grid } from "../grid/grid";
import { historyReducer, newDefaultTickHistory } from "./tick-history";

type GridStateWrapper = {
    grid: Grid;
    historyPosition: number;
    historyLength: number;
    
    clear: () => void;
    tick: () => void;

    restart: (newGrid: Grid) => void;

    setHistoryPosition: (newPosition: number) => void;
    toggleCell: (coordinates: Coordinates) => void;
}

function useGrid(initialGrid: Grid): GridStateWrapper {
    const [ 
        tickHistory, 
        dispatchTickHistory
    ] = useReducer(historyReducer, newDefaultTickHistory(initialGrid));

    return {
        grid: tickHistory.grid,
        historyPosition: tickHistory.position,
        historyLength: tickHistory.length,

        tick: () => dispatchTickHistory({ type: "tick" } ),
        clear: () => dispatchTickHistory({ type: "clear"} ),
        restart: (newGrid: Grid) => dispatchTickHistory({ type: "reset", value: newGrid}),
        setHistoryPosition: (newPosition: number) => {
            dispatchTickHistory({ type: "setPosition", value: newPosition})
        },
        toggleCell: (coordinates: Coordinates) => dispatchTickHistory({type: "toggle", value: coordinates})
    }
}

export type { GridStateWrapper };
export { useGrid };