
import { fireEvent, render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import SettingsDrawer from "./SettingsDrawer";
import { CSSTransition } from 'react-transition-group';

const fakeSettingsDrawerProps: ComponentProps<typeof SettingsDrawer> = {
    historyLength: 0,
    historyPosition: 0,
    setHistoryPosition: jest.fn(),
    startNewGame: jest.fn(),
    settings: jest.fn() as any,
    dispatchSettings: jest.fn(),
    clear: jest.fn(),
    playback: jest.fn() as any,
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

jest.mock('react-transition-group', () => {
    const FakeTransition = jest.fn(({children}) => children);
    const FakeCSSTransition = jest.fn(props =>
      props.in ? <FakeTransition>{props.children}</FakeTransition> : null,
    );
    return {CSSTransition: FakeCSSTransition, Transition: FakeTransition};
  });

describe("SettingsDrawer", () => {

    test("can be hidden/shown", () => {
        render(<SettingsDrawer {...fakeSettingsDrawerProps} />);

        // It's initially present
        expect(screen.getByTestId("drawer")).toBeInTheDocument();

        // When clicking the toggle
        fireEvent.click(screen.getByTitle("toggle-drawer"), { bubbles: true });

        // It hidden (under the bottom)
        expect(screen.queryByTestId("drawer")).not.toBeInTheDocument();
    });
});