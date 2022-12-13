import { usePerformanceTracker } from "./use-performance-tracker";
import { renderHook, act } from "@testing-library/react";
import { range } from "lodash";

describe("usePerformanceTracker", () => {

    /**
     * Testing ticks with enough time between them to be iterations from a single grid, and not
     * several grids ticking together.
     */
    test("correct duration for spaced ticks", () => {
        // ARRANGE
        const { result } = renderHook(() => usePerformanceTracker(false));

        // ACT
        act(() => {
            for (const i of range(0, 10)) {
                result.current.recordSample({ timeSpentMs: 100, timeOfRecord: new Date(i * 10000) });
            }
        });

        act(() => {
            result.current.updateBatches();
        });

        // ASSERT
        expect(result.current.averageOverhead).toBe(100);
    });

    test("correctly batches ticks", () => {
        // ARRANGE
        const { result } = renderHook(() => usePerformanceTracker(false));

        // ACT
        act(() => {
            let nextTickTime = 0;
            for (const i of range(1, 10)) {
                result.current.recordSample({ timeSpentMs: 50, timeOfRecord: new Date(nextTickTime) });
                // Tries to send ticks in batches of three, so every thirdtick, sets the next one to
                // have a time 100 seconds in the future
                if (i % 3 === 0) {
                    nextTickTime += 100_000;
                } else {
                    nextTickTime += 10;
                }
            }
        });

        act(() => {
            result.current.updateBatches();
        });

        // ASSERT
        // 150 is the total duration of each batch
        expect(result.current.averageOverhead).toBe(150);
    });

    test("correctly detects slow performance", () => {
        // ARRANGE
        const { result } = renderHook(() => usePerformanceTracker(false));

        // ACT
        act(() => {
            for (const i of range(0, 10)) {
                result.current.recordSample({ timeSpentMs: 500, timeOfRecord: new Date(i * 10000) });
            }
        });

        act(() => {
            result.current.updateBatches();
        });

        // ASSERT
        expect(result.current.isSlow).toBe(true);
    });

    test("doesn't detect normal tick speeds as slow", () => {
        // ARRANGE
        const { result } = renderHook(() => usePerformanceTracker(false));

        // ACT
        act(() => {
            for (const i of range(0, 10)) {
                result.current.recordSample({ timeSpentMs: 50, timeOfRecord: new Date(i * 10000) });
            }
        });

        act(() => {
            result.current.updateBatches();
        });

        // ASSERT
        expect(result.current.averageOverhead).toBe(50);
        expect(result.current.isSlow).toBe(false);
    });

    describe("disabled features", () => {

        // I don't know why I can't put the render in the describe block to reuse that logic
        // among the two tests
        test("correctly disables two features when slow", () => {
            // ARRANGE
            const { result } = renderHook(() => usePerformanceTracker(false));

            // ACT
            act(() => {
                for (const i of range(0, 10)) {
                    result.current.recordSample({ timeSpentMs: 200, timeOfRecord: new Date(i * 10000) });
                }
            });

            act(() => {
                result.current.updateBatches();
            });

            // ASSERT
            expect(result.current.disabledFeatures.length).toBe(2);
        });

        test("enables the two features back when performance is fast again", () => {
            // ARRANGE
            const { result } = renderHook(() => usePerformanceTracker(false));

            // ACT
            act(() => {
                for (const i of range(0, 10)) {
                    result.current.recordSample({ timeSpentMs: 200, timeOfRecord: new Date(i * 10000) });
                }
            });

            act(() => {
                result.current.updateBatches();
            });

            expect(result.current.disabledFeatures.length).toBe(2); // SANITY CHECK

            act(() => {
                for (const i of range(0, 30)) {
                    result.current.recordSample({ timeSpentMs: 5, timeOfRecord: new Date(i * 10000) });
                }
            });

            act(() => {
                result.current.updateBatches();
            });

            // ASSERT
            expect(result.current.disabledFeatures.length).toBe(0);
        });
    });
});