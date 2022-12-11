import CanvasGameGrid from "./CanvasGameGrid";
import renderer from "react-test-renderer";
import { Coordinates } from "../../grid/grid";
import { SetGrid } from "../../grid/set-grid";
import tuple from "immutable-tuple";
import { render, screen } from "@testing-library/react";
import "jest-canvas-mock";
import * as beautifulReactHooks from "beautiful-react-hooks";

// Ensure the whole grid is visible
jest.spyOn(beautifulReactHooks, "useViewportState").mockImplementation(() => ({
    height: 10000,
    width: 10000,
    scrollX: 0,
    scrollY: 0,
}));

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

const liveCells: Coordinates[] = [tuple(2, 3), tuple(2, 1), tuple(3, 2), tuple(3,3), tuple(4, 2)];
describe("CanvasGameGrid", () => {
    const cellSize = 3;
    const cellSizePixels = cellSize * 8;
    // TODO: Get these from the theme
    const aliveColor = "#000000";
    const deadColor = "#F0F0F0";

    test("live cells are colored as alive", () => {
        // ARRANGE & ACT
        render(<CanvasGameGrid grid={new SetGrid(liveCells)} toggleCell={jest.fn()} cellSize={cellSize}/>);

        // ASSERT
        const canvas: HTMLCanvasElement = screen.getByTestId("canvas");
        const events = canvas.getContext("2d")!.__getEvents();
        
        for (const [x, y] of liveCells) {
            const fillRectEventIndex = events.findIndex(({props}) => props.x === x * cellSizePixels && props.y === y * cellSizePixels);
            const fillRectEvent = events[fillRectEventIndex];
            const fillStyleEvent = events[fillRectEventIndex - 1];
            expect(fillRectEvent.type).toBe("fillRect");
            expect(fillStyleEvent.type).toBe("fillStyle");
            expect(fillStyleEvent.props).toEqual({ value: aliveColor} );

        }
    });

    // TODO: Test dead cells
    // TODO: Test hover
    // TODO: Test toggle

    test("snapshot", () => {
        expect(renderer.create(
            <CanvasGameGrid 
                grid={new SetGrid(liveCells)}
                toggleCell={jest.fn()}
                cellSize={3} 
            />
        ).toJSON()).toMatchSnapshot();
    });
});