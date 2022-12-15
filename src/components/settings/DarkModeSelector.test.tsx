import { fireEvent, render, screen  } from "@testing-library/react";
import * as usehooks from "usehooks-ts";
// @ts-ignore (there are no types for this)
import preloadAll from "jest-next-dynamic";

import DarkModeSelector from "./DarkModeSelector";


describe("DarkModeSelector", () => {
    test("clicking toggles it", async () => {
        await preloadAll();
        const toggle = jest.fn();
        jest.spyOn(usehooks, "useDarkMode").mockImplementationOnce(() => ({
            isDarkMode: false,
            toggle,
            enable: jest.fn(),
            disable: jest.fn(),
        }));

        render(<DarkModeSelector />);
        
        fireEvent.click(screen.getByLabelText("toggle dark mode"));

        expect(toggle).toHaveBeenCalledTimes(1);
    });

    test("when dark, the icon is a moon", async () => {
        await preloadAll();
        jest.spyOn(usehooks, "useDarkMode").mockImplementationOnce(() => ({
            isDarkMode: true,
            toggle: jest.fn(),
            enable: jest.fn(),
            disable: jest.fn(),
        }));

        render(<DarkModeSelector />);
        
        expect(screen.getByTitle("moon")).toBeInTheDocument();
    });

    test("when light, the icon is a sun", async () => {
        await preloadAll();
        jest.spyOn(usehooks, "useDarkMode").mockImplementationOnce(() => ({
            isDarkMode: false,
            toggle: jest.fn(),
            enable: jest.fn(),
            disable: jest.fn(),
        }));

        render(<DarkModeSelector />);
        
        expect(screen.getByTitle("sun")).toBeInTheDocument();
    });
});