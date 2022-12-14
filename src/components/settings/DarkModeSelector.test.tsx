import { fireEvent, render, screen  } from "@testing-library/react";
import DarkModeSelector from "./DarkModeSelector";
import * as usehooks from "usehooks-ts";

describe("DarkModeSelector", () => {
    test("clicking toggles it", () => {
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