import { render, screen, within } from "@testing-library/react";
import { defaultSettings, GameSettings } from "../../settings/settings";
import GameSettingsView from "./GameSettingsView";

const testSettings: GameSettings = {
    height: 10,
    width: 10,
    birthFactor: 0.2,
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

describe("GameSettingsView", () => {

    test("it shows all correct settings", () => {
        render(<GameSettingsView settings={testSettings} dispatchSettings={jest.fn()} />);

        expect(
            (within(
                screen.getByLabelText("View:"))
                      .getByRole("option", { name: "ascii" }) as HTMLOptionElement
        ).selected).toBe(true);
    });
});