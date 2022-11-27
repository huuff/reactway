import { renderHook, act } from "@testing-library/react";
import { defaultSettings, useSettings } from "./settings"
import * as usehooks from "usehooks-ts";
import mockRouter from "next-router-mock";
import singletonRouter from "next/router";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockRouter.push("/game");
});

describe("settings", () => {

    test("gets settings from query params", () => {
        const { result } = renderHook(() => useSettings());

        act(() => {
            mockRouter.push("/game?seed=SEED&height=5&width=5&tickDuration=5&birthFactor=5&view=ascii&type=map");

        });

        const [settings, _] = result.current;

        expect(settings.height).toBe(5);
        expect(settings.width).toBe(5);
        expect(settings.birthFactor).toBe(5);
        expect(settings.tickDuration).toBe(5);
        expect(settings.view).toBe("ascii");
        expect(settings.type).toBe("map");
    });

    test("sets local storage on dispatch", async () => {
        // ARRANGE
        const setLocalStorage = jest.fn();
        jest.spyOn(usehooks, "useLocalStorage").mockImplementation(
            () => [defaultSettings, setLocalStorage]
        );

        const { result } = renderHook(() => useSettings())
        const [_, dispatchSettings] = result.current;

        // ACT
        act(() => dispatchSettings({ type: "setHeight", value: 7 }));

        // ASSERT
        expect(setLocalStorage).toBeCalledWith({ ...defaultSettings, height: 7 });
    });

    test("sets querystring on dispatch", async () => {
        // ARRANGE
        const { result } = renderHook(() => useSettings());
        const [_, dispatchSettings] = result.current;

        // ACT
        act(() => dispatchSettings({ type: "setWidth", value: 7 }));

        // ASSERT
        expect(singletonRouter.query.width).toBe("7");
    });

    describe("cellSize", () => {
        test("increment", () => {
            // ARRANGE
            const { result } = renderHook(() => useSettings());
            const [, dispatchSettings] = result.current;

            // ACT
            act(() => dispatchSettings({ type: "changeCellSize", value: "increment" }))

            // ASSERT
            const [settings, _] = result.current;
            expect(settings.cellSize).toBe(defaultSettings.cellSize + 1);
        });

        test("decrement", () => {
            // ARRANGE
            const { result } = renderHook(() => useSettings());
            const [, dispatchSettings] = result.current;

            // ACT
            act(() => dispatchSettings({ type: "changeCellSize", value: "decrement" }))

            // ASSERT
            const [settings, _] = result.current;
            expect(settings.cellSize).toBe(defaultSettings.cellSize - 1);
        });
    });
})