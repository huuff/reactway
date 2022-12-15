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
});