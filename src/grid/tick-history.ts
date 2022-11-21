import { ConwayStrategy, defaultConwayStrategy } from "../game/conway-strategy";
import { Grid } from "./grid";

// TODO: I think I should give this a better name
type TickHistory = {
    readonly contents: Grid[];
    readonly length: number;
    readonly position: number;
    readonly current: Grid;
    readonly conwayStrategy: ConwayStrategy;
}

type HistoryAction = {
    type: "reset",
    value: Grid,
} | {
    type: "tick",
} | {
    type: "setPosition",
    value: number,
} | {
    type: "setConwayStrategy",
    value: ConwayStrategy,
};

// TODO: Test
function historyReducer(previous: TickHistory, action: HistoryAction): TickHistory {
    switch (action.type) {
        case "reset":
            return {
                contents: [action.value],
                length: 1,
                position: 0,
                current: action.value,
                conwayStrategy: previous.conwayStrategy,
            };
        // TODO: Prevent storing further ticks when they don't change
        case "tick":
            if (previous.position === previous.length - 1) {
                // It's at the end of the history, and thus the next tick should give
                // a new history
                const nextGrid = previous.current.tick(previous.conwayStrategy);
                return {
                    contents: [...previous.contents, nextGrid],
                    length: previous.length + 1,
                    position: previous.length,
                    current: nextGrid,
                    conwayStrategy: previous.conwayStrategy,
                }
            } else {
                // It's in the middle of the grid so we only have to change the position and
                // current grid
                const nextPosition = previous.position + 1;
                return {
                    ...previous,
                    position: nextPosition,
                    current: previous.contents[nextPosition],
                }

            }
        case "setPosition":
            const nextPosition = action.value;
            if (nextPosition >= 0 && nextPosition < previous.length) {
                return {
                    ...previous,
                    position: nextPosition,
                    current: previous.contents[nextPosition],
                };
            } else {
                return previous;
            } 
        case "setConwayStrategy":
            return {
                ...previous,
                conwayStrategy: action.value,
            }
    }
}

function newDefaultTickHistory(initialGrid: Grid): TickHistory {
    return {
        contents: [initialGrid],
        position: 0,
        length: 1,
        current: initialGrid,
        conwayStrategy: defaultConwayStrategy,
    }
}

export type { HistoryAction };
export { historyReducer, newDefaultTickHistory };