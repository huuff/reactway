import { ConwayStrategy, defaultConwayStrategy } from "./conway-strategy";
import { Coordinates, Grid } from "../grid/grid";
import { getGridFactory } from "../grid/grid-factory";
import { trimArray } from "../util/trim-array";

const MAX_HISTORY_LENGTH = 15;

type TickHistory = {
    readonly contents: Grid[];
    readonly length: number;
    readonly position: number;
    readonly grid: Grid;
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
} | {
    type: "clear",
};

// TODO: Test
function historyReducer(previous: TickHistory, action: HistoryAction): TickHistory {
    switch (action.type) {
        case "reset":
            return {
                contents: [action.value],
                length: 1,
                position: 0,
                grid: action.value,
                conwayStrategy: previous.conwayStrategy,
            };
        case "clear":
            const createGrid = getGridFactory(previous.grid.type)
            const emptyGrid = createGrid({
                height: previous.grid.height,
                width: previous.grid.width,
                birthFactor: 0,
                seed: "any will do since it's empty"
            });
            return {
                contents: [...previous.contents, emptyGrid],
                length: previous.length + 1,
                position: previous.length,
                grid: emptyGrid,
                conwayStrategy: previous.conwayStrategy, 
            }
        case "tick":
            if (previous.position === previous.length - 1) {
                // It's at the end of the history, and thus the next tick should give
                // a new history
                const nextGrid = previous.grid.tick(previous.conwayStrategy);
                const {
                    array: newContents,
                    newLength,
                } = trimArray([...previous.contents, nextGrid], MAX_HISTORY_LENGTH);
                if (!nextGrid.equals(previous.grid)) {
                    return {
                        contents: newContents,
                        length: newLength,
                        position: newLength - 1,
                        grid: nextGrid,
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
                    grid: previous.contents[nextPosition],
                }

            }
        case "setPosition":
            const nextPosition = action.value;
            if (nextPosition >= 0 && nextPosition < previous.length) {
                return {
                    ...previous,
                    position: nextPosition,
                    grid: previous.contents[nextPosition],
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
            const nextGrid = previous.grid.toggle(targetX, targetY);
            const { 
                array: newContents, 
                newLength 
            } = trimArray([...previous.contents, nextGrid], MAX_HISTORY_LENGTH)
            return {
                contents: newContents,
                length: newLength,
                position: newLength - 1,
                grid: nextGrid,
                conwayStrategy: previous.conwayStrategy,
            }
    }
}

function newDefaultTickHistory(initialGrid: Grid): TickHistory {
    return {
        contents: [initialGrid],
        position: 0,
        length: 1,
        grid: initialGrid,
        conwayStrategy: defaultConwayStrategy,
    }
}

export type { HistoryAction };
export { historyReducer, newDefaultTickHistory };