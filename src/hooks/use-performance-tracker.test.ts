import { usePerformanceTracker } from "./use-performance-tracker";
import { renderHook, act } from "@testing-library/react";
import { range } from "lodash";

describe("usePerformanceTracker", () => {

    test("correctly detects slow performance", () => {
        // ARRANGE
        const { result } = renderHook(() => usePerformanceTracker());

        // ACT
        act(() => {
            for (const i in range(0, 10)) {
                result.current.recordTick(150, new Date("2022-12-08T00:00:00"));
            }
        })

        // ASSERT
        expect(result.current.isSlow).toBe(true);
    });
})