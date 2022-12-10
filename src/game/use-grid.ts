import { useCallback, useContext, useEffect, useReducer } from "react";
import { Coordinates, Grid } from "../grid/grid";
import { PerformanceTrackerContext } from "../hooks/use-performance-tracker";
import { historyReducer, newDefaultTickHistory } from "./tick-history";

type GridStateWrapper = {
    grid: Grid;
    historyPosition: number;
    historyLength: number;
    lastTickDurationMs?: number;
    
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

    const performanceTracker = useContext(PerformanceTrackerContext);

    useEffect(() => {
        tickHistory.lastTickDurationMs && performanceTracker.recordTick(tickHistory.lastTickDurationMs, new Date());
    }, [tickHistory])

    return {
        grid: tickHistory.grid,
        historyPosition: tickHistory.position,
        historyLength: tickHistory.length,
        lastTickDurationMs: tickHistory.lastTickDurationMs,

        tick: useCallback(() => dispatchTickHistory({ type: "tick" } ), [dispatchTickHistory]),
        clear: useCallback(() => dispatchTickHistory({ type: "clear"} ), [dispatchTickHistory]),
        restart: useCallback((newGrid: Grid) => {
            dispatchTickHistory({ type: "reset", value: newGrid}), [dispatchTickHistory]
        }, [dispatchTickHistory]),
        setHistoryPosition: useCallback((newPosition: number) => {
            dispatchTickHistory({ type: "setPosition", value: newPosition})
        }, [ dispatchTickHistory]),
        toggleCell: useCallback((coordinates: Coordinates) => {
            dispatchTickHistory({type: "toggle", value: coordinates})
        }, [ dispatchTickHistory]),
    }
}

export type { GridStateWrapper };
export { useGrid };