import { renderHook, act } from "@testing-library/react";
import { usePlayback } from "./use-playback";

describe("useHook", () => {

    test("start", () => {
        const { result } = renderHook(() => usePlayback("pause"));

        act(() => result.current.start());

        expect(result.current.isPlaying).toBe(true);
    });

    test("pause", () => {
        const { result } = renderHook(() => usePlayback("play"));

        act(() => result.current.pause());

        expect(result.current.isPlaying).toBe(false);
    });
});