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
        const { result } = renderHook(() => usePerformanceTracker());

        // ACT
        act(() => {
            for (const i of range(0, 10)) {
                result.current.recordTick(100, new Date(i * 10000));
            }
        })

        // ASSERT
        expect(result.current.averageTickDuration).toBe(100);
    });

    test("correctly batches ticks", () => {
        // ARRANGE
        const { result } = renderHook(() => usePerformanceTracker());

        // ACT
        act(() => {
            let nextTickTime = 0;
            for (const i of range(1, 10)) {
                result.current.recordTick(50, new Date(nextTickTime));
                // Tries to send ticks in batches of three, so every thirdtick, sets the next one to
                // have a time 100 seconds in the future
                if (i % 3 === 0) {
                    nextTickTime += 100_000
                } else {
                    nextTickTime += 10
                }
            }
        })

        // ASSERT
        // 150 is the total duration of each batch
        expect(result.current.averageTickDuration).toBe(150);
    });

    test("correctly detects slow performance", () => {
        // ARRANGE
        const { result } = renderHook(() => usePerformanceTracker());

        // ACT
        act(() => {
            for (const i of range(0, 10)) {
                result.current.recordTick(150, new Date(i * 10000));
            }
        })

        // ASSERT
        expect(result.current.isSlow).toBe(true);
    });

    test("doesn't detect normal tick speeds as slow", () => {
        // ARRANGE
        const { result } = renderHook(() => usePerformanceTracker());

        // ACT
        // ACT
        act(() => {
            for (const i of range(0, 10)) {
                result.current.recordTick(50, new Date(i * 10000));
            }
        })

        // ASSERT
        expect(result.current.isSlow).toBe(false);
    });
})