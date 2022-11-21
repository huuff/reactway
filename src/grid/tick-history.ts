import { ConwayStrategy, defaultConwayStrategy } from "../game/conway-strategy";
import { Coordinates, Grid } from "./grid";

// TODO: I think I should give this a better name
type TickHistory = {
    readonly contents: Grid[];
    readonly length: number;
    readonly position: number;
    // TODO: Some better name? Like `grid`? All uses of `previous.current` look strange
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
} | {
    type: "toggle",
    value: Coordinates,
};

// TODO: Trimming the history when it gets long
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
        case "tick":
            if (previous.position === previous.length - 1) {
                // It's at the end of the history, and thus the next tick should give
                // a new history
                const nextGrid = previous.current.tick(previous.conwayStrategy);
                if (!nextGrid.equals(previous.current)) {
                    return {
                        contents: [...previous.contents, nextGrid],
                        length: previous.length + 1,
                        position: previous.length,
                        current: nextGrid,
                        conwayStrategy: previous.conwayStrategy,
                    }
                } else {
                    return previous;
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
        case "toggle":
            const [targetX, targetY] = action.value;
            const nextGrid = previous.current.toggle(targetX, targetY);
            return {
                contents: [...previous.contents, nextGrid],
                length: previous.length + 1,
                position: previous.length,
                current: nextGrid,
                conwayStrategy: previous.conwayStrategy,
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