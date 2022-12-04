import { renderHook, act } from "@testing-library/react";
import { useReducer } from "react";
import { SetGrid } from "../grid/set-grid";
import { defaultConwayStrategy } from "./conway-strategy";
import { historyReducer, newDefaultTickHistory } from "./tick-history";
import tuple from "immutable-tuple";


const initialGrid = new SetGrid([tuple(1, 1), tuple(2, 2)], 2, 2);
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
        const nextGrid = new SetGrid([tuple(1, 0), tuple(1, 1)], 2, 2);


        // ACT
        act(() => {
            const [, dispatch] = result.current;
            dispatch({ type: "reset", value: nextGrid });
        })

        // ASSERT
        const [history,] = result.current;
        expect(history.grid).toStrictEqual(nextGrid);
        expect(history.contents).toStrictEqual([nextGrid]);
        expect(history.length).toBe(1);
        expect(history.position).toBe(0);
    });

    test("clear", () => {
        // ARRANGE
        const { result } = renderHook(() => useReducer(
            historyReducer,
            newDefaultTickHistory(initialGrid)
        ));

        // ACT
        act(() => {
            const [, dispatch] = result.current;
            dispatch({ type: "clear" });
        });

        // ASSERT
        const [history,] = result.current;
        expect(history.grid.height).toBe(initialGrid.height);
        expect(history.grid.width).toBe(initialGrid.width);
        for (const { isAlive } of history.grid) {
            expect(isAlive).toBe(false);
        }
        expect(history.length).toBe(2);
        expect(history.position).toBe(1);
        expect(history.contents[0].equals(initialGrid)).toBe(true)
        expect(history.contents[1].equals(new SetGrid([], initialGrid.height, initialGrid.width))).toBe(true)
    });

    describe("tick", () => {
        test("at the end of history", () => {
            // ARRANGE
            const { result } = renderHook(() => useReducer(
                historyReducer,
                newDefaultTickHistory(initialGrid)
            ));
    
            // ACT
            act(() => {
                const [ , dispatch ] = result.current;
                dispatch({ type: "tick" });
            });
    
            // ASSERT
            const nextGrid = initialGrid.tick(defaultConwayStrategy);
            const [ history, ] = result.current;
            expect(history.length).toBe(2);
            expect(history.grid.equals(nextGrid)).toBe(true);
            expect(history.contents[0].equals(initialGrid)).toBe(true);
            expect(history.contents[1].equals(nextGrid)).toBe(true);
            expect(history.position).toBe(1);
        });

        test("in the middle of history", () => {
            // ARRANGE
            const firstGrid = new SetGrid([tuple(1, 1)], 2, 2);
            const secondGrid = new SetGrid([tuple(1, 2)], 2, 2);
            const { result } = renderHook(() => useReducer(
                historyReducer,
                {
                    contents: [ firstGrid, secondGrid ],
                    position: 0,
                    length: 2,
                    grid: firstGrid,
                    conwayStrategy: defaultConwayStrategy,
                }
            ));

            // ACT
            act(() => {
                const [, dispatch] = result.current;
                dispatch({type: "tick"});
            })

            // ASSERT
            const [ history, ] = result.current;
            expect(history.contents).toStrictEqual([firstGrid, secondGrid]);
            expect(history.position).toBe(1);
            expect(history.length).toBe(2);
            expect(history.grid).toStrictEqual(secondGrid);
        });

        test("setPosition", () => {
            // ARRANGE
            const firstGrid = new SetGrid([tuple(1, 1)], 2, 2);
            const secondGrid = new SetGrid([tuple(1, 2)], 2, 2);
            const { result } = renderHook(() => useReducer(
                historyReducer,
                {
                    contents: [ firstGrid, secondGrid ],
                    position: 1,
                    length: 2,
                    grid: secondGrid,
                    conwayStrategy: defaultConwayStrategy,
                }
            ));

            // ACT
            act(() => {
                const [, dispatch] = result.current;
                dispatch({type: "setPosition", value: 0});
            })

            // ASSERT
            const [ history, ] = result.current;
            expect(history.contents).toStrictEqual([firstGrid, secondGrid]);
            expect(history.position).toBe(0);
            expect(history.length).toBe(2);
            expect(history.grid).toStrictEqual(firstGrid);
        });

        test("toggle", () => {
            // ARRANGE
            const initialGrid = new SetGrid([tuple(1,1)], 2, 2);
            const { result } = renderHook(() => useReducer(
                historyReducer,
                newDefaultTickHistory(initialGrid))
            );
    
    
            // ACT
            act(() => {
                const [, dispatch] = result.current;
                dispatch({ type: "toggle", value: tuple(1,1) });
            })
    
            // ASSERT
            const [history,] = result.current;
            const expectedNextGrid = initialGrid.toggle(tuple(1, 1));
            expect(history.grid.equals(expectedNextGrid)).toBe(true);
            expect(history.length).toBe(2);
            expect(history.position).toBe(1);
            expect(history.contents[0].equals(initialGrid)).toBe(true);
            expect(history.contents[1].equals(expectedNextGrid)).toBe(true);
        });

    });
});