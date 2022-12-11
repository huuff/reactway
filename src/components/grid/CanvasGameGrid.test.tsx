import CanvasGameGrid from "./CanvasGameGrid";
import renderer from "react-test-renderer";
import { Coordinates } from "../../grid/grid";
import { SetGrid } from "../../grid/set-grid";
import tuple from "immutable-tuple";
import { fireEvent, render, screen } from "@testing-library/react";
import "jest-canvas-mock";
import * as beautifulReactHooks from "beautiful-react-hooks";
import * as usehooks from "usehooks-ts";
import theme from "../../../theme";

// Ensure the whole grid is visible
jest.spyOn(beautifulReactHooks, "useViewportState").mockImplementation(() => ({
    height: 10000,
    width: 10000,
    scrollX: 0,
    scrollY: 0,
}));

jest.spyOn(usehooks, "useDebounce").mockImplementation((fn) => fn);

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

// XXX: Otherwise, js-dom is not able to provide a working definition of it
function fakeBoundingRect(element: HTMLCanvasElement) {
    element.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        right: 1000,
        bottom: 1000,
        height: 1000,
        width: 1000,
        x: 0,
        y: 0,
        toJSON: jest.fn(),
    }));
}

const liveCells: Coordinates[] = [tuple(2, 3), tuple(2, 1), tuple(3, 2), tuple(3,3), tuple(4, 2)];
describe("CanvasGameGrid", () => {
    const cellSize = 3;
    const cellSizePixels = cellSize * 8;
    const aliveColor = theme.light.cell.alive.color;
    const deadColor = theme.light.cell.dead.color;

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

    test("dead cells are colored as dead", () => {
        // ARRANGE & ACT
        const grid = new SetGrid(liveCells);
        render(<CanvasGameGrid grid={grid} toggleCell={jest.fn()} cellSize={cellSize}/>);

        // ASSERT
        const canvas: HTMLCanvasElement = screen.getByTestId("canvas");
        const events = canvas.getContext("2d")!.__getEvents();

        for (const { coordinates: [x,y], isAlive} of grid) {
            if (!isAlive) {
                const strokeRectEventIndex = events.findIndex(({props}) => props.x === x * cellSizePixels && props.y === y * cellSizePixels);
                const strokeRectEvent = events[strokeRectEventIndex];
                const fillStyleEvent = events[strokeRectEventIndex - 1];
                expect(strokeRectEvent.type).toBe("strokeRect");
                expect(fillStyleEvent.type).toBe("fillStyle");
                expect(fillStyleEvent.props).toEqual({ value: deadColor.toLowerCase()} );
            }
        }
    });

    test("hovering over a cell paints it as hovered", () => {
        // ARRANGE
        render(<CanvasGameGrid grid={new SetGrid(liveCells)} toggleCell={jest.fn()} cellSize={cellSize}/>);
        const targetCell = tuple(2, 2);

        // ACT
        const canvas: HTMLCanvasElement = screen.getByTestId("canvas");
        fakeBoundingRect(canvas);
        fireEvent.mouseMove(canvas, {
            clientX: targetCell[0] * cellSizePixels,
            clientY: targetCell[1] * cellSizePixels,
        });

        // ASSERT
        const events = canvas.getContext("2d")!.__getEvents();
        const paintTargetCellEventIndex = events.findIndex((e) => {
            return e.props.x === targetCell[0] * cellSizePixels
                 && e.props.y === targetCell[1] * cellSizePixels
                 && e.props.width === cellSizePixels-1
                 && e.props.height === cellSizePixels-1
                 && e.type === "fillRect"
                 ;
        });
        const paintTargetCellEvent = events[paintTargetCellEventIndex];
        // Second to last element before it, because there's a strokeRect before to paint the borders of the
        // cell
        const paintTargetCellColorEvent = events[paintTargetCellEventIndex-2];

        console.log(JSON.stringify(events.slice(paintTargetCellEventIndex-3, paintTargetCellEventIndex+1)));
        expect(paintTargetCellEvent.type).toBe("fillRect"); // Kind of unnecessary
        expect(paintTargetCellColorEvent.type).toBe("fillStyle");
        expect(paintTargetCellColorEvent.props).toEqual({ value: theme.light.cell.hovered.dead.color.toLowerCase() });
    });

    test("clicking on a cell toggles it", () => {
        // ARRANGE
        const toggleCell = jest.fn();
        render(<CanvasGameGrid grid={new SetGrid(liveCells)} toggleCell={toggleCell} cellSize={cellSize}/>);
        const targetCell = tuple(2, 2);

        // ACT
        const canvas: HTMLCanvasElement = screen.getByTestId("canvas");
        fakeBoundingRect(canvas);
        fireEvent.mouseMove(canvas, {
            clientX: targetCell[0] * cellSizePixels,
            clientY: targetCell[1] * cellSizePixels,
        });
        fireEvent.mouseUp(canvas, {
            clientX: targetCell[0] * cellSizePixels,
            clientY: targetCell[1] * cellSizePixels,
        });

        // ASSERT
        expect(toggleCell).toHaveBeenCalledWith(targetCell);
    });

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