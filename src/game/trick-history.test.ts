import { renderHook, act } from "@testing-library/react";
import { useReducer } from "react";
import { SetGrid } from "../grid/set-grid";
import { historyReducer, newDefaultTickHistory } from "./tick-history";

const initialGrid = new SetGrid([[1, 1], [2, 2]], 2, 2);
describe("TickHistory", () => {

    test("newDefaultTickHistory", () => {
        const tickHistory = newDefaultTickHistory(initialGrid);

        expect(tickHistory.contents).toStrictEqual([initialGrid]);
        expect(tickHistory.grid).toStrictEqual(initialGrid);
        expect(tickHistory.length).toBe(1);
        expect(tickHistory.position).toBe(0);
    });

    test("reset", () => {
        // ARRANGE
        const { result } = renderHook(() => useReducer(
            historyReducer,
            newDefaultTickHistory(initialGrid))
        );
        const nextGrid = new SetGrid([[1,0], [1,1]], 2, 2);
        

        // ACT
        act(() => {
            const [ , dispatch ] = result.current;
            dispatch({type: "reset", value: nextGrid});
        })

        // ASSERT
        const [ history, ] = result.current;
        expect(history.grid).toStrictEqual(nextGrid);
        expect(history.contents).toStrictEqual([nextGrid]);
        expect(history.length).toBe(1);
        expect(history.position).toBe(0);
    });
});