import { defaultSettings, useSettings } from "./settings"
import { fireEvent, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"; // TODO: In setupTest
import * as usehooks from "usehooks-ts";
import mockRouter from "next-router-mock";
import singletonRouter from "next/router";



jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockRouter.push("/game");
});

// TODO: Maybe inject default settings instead of hardcoding them?
const FakeSettingsComponent = () => {
    const [settings, dispatchSettings] = useSettings()

    return (
        <div>
            <p data-testid="height">{settings.height}</p>
            <p data-testid="width">{settings.width}</p>
            <p data-testid="birth-factor">{settings.birthFactor}</p>
            <p data-testid="tick-duration">{settings.tickDuration}</p>
            <p data-testid="view">{settings.view}</p>
            <p data-testid="type">{settings.type}</p>

            <button data-testid="set-height"
                onClick={() => dispatchSettings({ type: "setHeight", value: 5 })}
            />
            <button data-testid="set-width"
                onClick={() => dispatchSettings({ type: "setWidth", value: 5 })}
            />
            <button data-testid="set-birth-factor"
                onClick={() => dispatchSettings({ type: "setBirthFactor", value: 5 })}
            />
            <button data-testid="set-tick-duration"
                onClick={() => dispatchSettings({ type: "setTickDuration", value: 5 })}
            />
            <button data-testid="set-view"
                onClick={() => dispatchSettings({ type: "setView", value: "ascii" })}
            />
            <button data-testid="set-type"
                onClick={() => dispatchSettings({ type: "setType", value: "map" })}
            />

        </div>
    )
}

describe("settings", () => {

    test("correctly renders settings", () => {
        render(<FakeSettingsComponent />);

        expect(screen.getByTestId("height")).toHaveTextContent(`${defaultSettings.height}`);
        expect(screen.getByTestId("width")).toHaveTextContent(`${defaultSettings.width}`);
        expect(screen.getByTestId("birth-factor")).toHaveTextContent(`${defaultSettings.birthFactor}`);
        expect(screen.getByTestId("tick-duration")).toHaveTextContent(`${defaultSettings.tickDuration}`);
        expect(screen.getByTestId("view")).toHaveTextContent(`${defaultSettings.view}`);
        expect(screen.getByTestId("type")).toHaveTextContent(`${defaultSettings.type}`);
    });

    test("gets settings from query params", () => {
        mockRouter.push("/game?seed=SEED&height=5&width=5&tickDuration=5&birthFactor=5&view=ascii&type=map");
        render(<FakeSettingsComponent />);

        expect(screen.getByTestId("height")).toHaveTextContent("5");
        expect(screen.getByTestId("width")).toHaveTextContent("5");
        expect(screen.getByTestId("birth-factor")).toHaveTextContent("5");
        expect(screen.getByTestId("tick-duration")).toHaveTextContent("5");
        expect(screen.getByTestId("view")).toHaveTextContent("ascii");
        expect(screen.getByTestId("type")).toHaveTextContent("map");
    });

    test("sets local storage on dispatch", async () => {
        // ARRANGE
        const setLocalStorage = jest.fn();
        jest.spyOn(usehooks, "useLocalStorage").mockImplementation(
            () => [defaultSettings, setLocalStorage]
        );

        render(<FakeSettingsComponent />);

        // ACT
        fireEvent(screen.getByTestId("set-height"), new MouseEvent("click", { bubbles: true }));

        // ASSERT
        expect(setLocalStorage).toBeCalledWith({ ...defaultSettings, height: 5 });
    });

    test("sets querystring on dispatch", async () => {
        // ARRANGE
        render(<FakeSettingsComponent />);

        // ACT
        fireEvent(screen.getByTestId("set-width"), new MouseEvent("click", { bubbles: true }));

        // ASSERT
        expect(singletonRouter.query.width).toBe("5");
    });
})