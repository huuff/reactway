import { fireEvent, render, screen } from "@testing-library/react";
import {  GameSettings, SettingsContext } from "../../settings/settings";
import GameSettingsView from "./GameSettingsView";
import * as usehooks from "usehooks-ts";

const testSettings: GameSettings = {
    height: 10,
    width: 10,
    birthFactor: 0.5,
    tickDuration: 1000,
    cellSize: 3,
    view: "ascii",
    type: "map",
};

// https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

jest.spyOn(usehooks, "useDebounce").mockImplementation((v) => v);

describe("GameSettingsView", () => {

    test("it shows all correct settings", () => {
        render(
            <SettingsContext.Provider value={[testSettings, jest.fn()]}>
                <GameSettingsView />
            </SettingsContext.Provider>
        );

        expect(screen.getByRole("combobox", { name: "View:" })).toHaveValue("ascii");
        expect(screen.getByRole("combobox", { name: "Type:" })).toHaveValue("map");
        expect(screen.getByRole("spinbutton", { name: "Width:" })).toHaveValue(10);
        expect(screen.getByRole("spinbutton", { name: "Height:" })).toHaveValue(10);
        expect(screen.getByRole("spinbutton", { name: "Birth factor:" })).toHaveValue(0.5);
        expect(screen.getByRole("spinbutton", { name: "Tick duration (ms):" })).toHaveValue(1000);
        expect(screen.getByText(/Cell size:/)).toHaveTextContent("3");
    });

    test("changing settings", () => {
        const mockDispatch = jest.fn();

        render(
            <SettingsContext.Provider value={[testSettings, mockDispatch]}>
                <GameSettingsView />
            </SettingsContext.Provider>
        );

        fireEvent.change(screen.getByRole("combobox", { name: /View/ }), { target: { value: "canvas" } });
        expect(mockDispatch).toHaveBeenCalledWith({ type: "setView", value: "canvas" });
        mockDispatch.mockClear();

        fireEvent.change(screen.getByRole("combobox", { name: /Type/}), { target: { value: "array"}} );
        expect(mockDispatch).toHaveBeenCalledWith({type: "setType", value: "array"});
        mockDispatch.mockClear();

        fireEvent.change(screen.getByRole("spinbutton", { name: /Width/}), { target: { value: 50}});
        expect(mockDispatch).toHaveBeenCalledWith({type: "setWidth", value: 50 });
        mockDispatch.mockClear();

        fireEvent.change(screen.getByRole("spinbutton", { name: /Height/}), { target: { value: 25}});
        expect(mockDispatch).toHaveBeenCalledWith({type: "setHeight", value: 25});        mockDispatch.mockClear();
        mockDispatch.mockClear();

        fireEvent.change(screen.getByRole("spinbutton", { name: /Birth factor/ }), { target: { value: 0.7 }});
        expect(mockDispatch).toHaveBeenCalledWith({type: "setBirthFactor", value: 0.7});
        mockDispatch.mockClear();

        fireEvent.change(screen.getByRole("spinbutton", { name: /Tick duration/}), { target: { value: 2000 }});
        expect(mockDispatch).toHaveBeenCalledWith({type: "setTickDuration", value: 2000});
        mockDispatch.mockClear();

        fireEvent.click(screen.getByTitle("decrease cell size"), { bubbles: true});
        expect(mockDispatch).toHaveBeenCalledWith({type: "changeCellSize", value: "decrement"});
        mockDispatch.mockClear();

        fireEvent.click(screen.getByTitle("increase cell size"), { bubbles: true});
        expect(mockDispatch).toHaveBeenCalledWith({type: "changeCellSize", value: "increment"});
        mockDispatch.mockClear();
    });
});