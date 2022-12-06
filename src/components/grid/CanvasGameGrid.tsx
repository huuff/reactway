import { MouseEventHandler, RefObject, useCallback, useEffect, useMemo, useRef } from "react";
import { Coordinates, GameGridProps, Grid } from "../../grid/grid";
import { useMouseState, usePreviousValue, useViewportState } from "beautiful-react-hooks";
import { useDarkMode, useDebounce } from "usehooks-ts";
import { Box2D } from "../../util/box-2d";
import tuple from "immutable-tuple";

const CELL_SIZE_MULTIPLIER = 8;

type CanvasGameGridProps = GameGridProps & {
    scrollX?: number;
    scrollY?: number;
};
type Size = {
    width: number;
    height: number;
}

function getBoundingRectOrZeros(ref: RefObject<HTMLElement>) {
    return ref.current?.getBoundingClientRect() ?? { left: 0, top: 0, right: 0, bottom: 0 };
}

function drawCell(
    canvasContext: CanvasRenderingContext2D,
    coordinates: Coordinates,
    isAlive: boolean,
    isDarkMode: boolean,
    cellSizePixels: number
) {
    const [x, y] = coordinates;
    if (isAlive) {
        canvasContext.fillStyle = isDarkMode ? "#262626" : "#000000";
    } else {
        canvasContext.fillStyle = isDarkMode ? "#666666" : "#F0F0F0";
        canvasContext.strokeRect(x * cellSizePixels, y * cellSizePixels, cellSizePixels, cellSizePixels);
    }
    canvasContext.fillRect(x * cellSizePixels, y * cellSizePixels, cellSizePixels, cellSizePixels);
}

// TODO: Test it? Can I?
const CanvasGameGrid = ({
    grid,
    className,
    toggleCell,
    cellSize,
    scrollX = 0,
    scrollY = 0,
}: CanvasGameGridProps) => {
    const { isDarkMode } = useDarkMode();
    const cellSizePixels = useMemo(() => CELL_SIZE_MULTIPLIER * cellSize, [cellSize]);
    const gridCanvasRef = useRef<HTMLCanvasElement>(null);

    const { width: windowWidth, height: windowHeight } = useViewportState();

    const gridSizePixels = useMemo(() => ({
        width: grid.width * cellSizePixels,
        height: grid.height * cellSizePixels,
    }), [grid.height, grid.width, cellSizePixels]);

    // TODO: Do I need scrollX and scrollY? I might be able to get them from the bounding rect of the grid
    const visibleCellBounds = useVisibleBounds(windowWidth, windowHeight, scrollX, scrollY, gridSizePixels, cellSizePixels)

    useDrawCanvasEffect(gridCanvasRef, grid, cellSizePixels, visibleCellBounds, isDarkMode);

    const hoveredCell = useDebounce(useHoveredCell(grid.width, grid.height, gridCanvasRef, cellSizePixels), 5);
    const previousHoveredCell = usePreviousValue(hoveredCell);
    const isMouseWithinGrid = useIsMouseWithinGrid(gridCanvasRef);

    // TODO: Split it somewhere
    // TODO: This leaves a weird trail of unaligned cell wherever it passes through
    // TODO: Disable when ticking is getting slow
    useEffect(() => {
        const canvas = gridCanvasRef.current!;

        const ctx = canvas.getContext("2d")!;

        // First, cleanup the previously hovered cell
        if (previousHoveredCell) {
            const isPreviousAlive = grid.get(previousHoveredCell);
            drawCell(ctx, previousHoveredCell, isPreviousAlive, isDarkMode, cellSizePixels);
        }

        if (!isMouseWithinGrid) {
            // The mouse is outside the grid, so it doesn't make sense to paint any hovered cell
            return;
        }

        // Then, we paint the currently hovered cell
        const isAlive = grid.get(hoveredCell);
        const [x, y] = hoveredCell;

        if (isAlive) {
            ctx.fillStyle = "#660000";
        } else {
            ctx.fillStyle = isDarkMode ? "#B30000" : "#FF3333";
        }
        ctx.fillRect(x * cellSizePixels, y * cellSizePixels, cellSizePixels, cellSizePixels);

    }, [hoveredCell, previousHoveredCell, grid, isMouseWithinGrid, isDarkMode])

    const onMouseUp = useClickToggleHandler(gridCanvasRef, hoveredCell, grid, toggleCell);


    return (
        <div onMouseUp={onMouseUp} className={className}>
            <canvas
                ref={gridCanvasRef}
                className="mx-auto"
                id="grid-canvas"
                height={gridSizePixels.height}
                width={gridSizePixels.width}
            ></canvas>
        </div>
    )
}

function useIsMouseWithinGrid(gridCanvasRef: RefObject<HTMLCanvasElement>): boolean {
    const { clientX, clientY } = useMouseState();
    const boundingRect = gridCanvasRef.current?.getBoundingClientRect();
    if (!boundingRect) {
        return false;
    }

    const { left, top, right, bottom } = boundingRect;

    return clientX >= left && clientX <= right && clientY >= top && clientY <= bottom;
}

/**
 * Returns a box that indicates the bounds of the visible part of the screen
 */
function useVisibleBounds(
    windowWidth: number,
    windowHeight: number,
    scrollX: number,
    scrollY: number,
    gridSizePixels: Size,
    cellSizePixels: number
): Box2D {
    const visibleBounds = useDebounce(useMemo<Box2D>(() => new Box2D(
        tuple(
            Math.max(scrollX - (windowWidth / 2), 0),
            Math.max(scrollY - (windowHeight / 2), 0)
        ),
        tuple(
            Math.min(scrollX + (windowWidth * 1.5), gridSizePixels.width),
            Math.min(scrollY + (windowHeight * 1.5), gridSizePixels.height),
        ),
    ), [windowHeight, windowWidth, scrollX, scrollY, gridSizePixels]), 250);
    const visibleCellBounds = useMemo<Box2D>(
        () => visibleBounds.divide(cellSizePixels),
        [visibleBounds, cellSizePixels]
    );

    return visibleCellBounds;
}

/**
 * Returns the cell (in the grid data structure) that the cursor is hovering
 */
const useHoveredCell = (
    gridWidth: number,
    gridHeight: number,
    gridCanvasRef: RefObject<HTMLCanvasElement>,
    cellSizePixels: number
): Coordinates => {
    const { clientX, clientY } = useMouseState();

    const { left: leftDisplacement, top: topDisplacement, } = getBoundingRectOrZeros(gridCanvasRef);

    const mouseX = Math.max(0, clientX - leftDisplacement)
    const mouseY = Math.max(0, clientY - topDisplacement)

    const result = tuple(
        Math.min(Math.floor((mouseX - (mouseX % cellSizePixels)) / cellSizePixels), gridWidth - 1),
        Math.min(Math.floor((mouseY - (mouseY % cellSizePixels)) / cellSizePixels), gridHeight - 1),
    );

    return result;
}

function useClickToggleHandler(
    ref: RefObject<HTMLCanvasElement>,
    mouseCell: Coordinates,
    grid: Grid,
    toggleCell: (coordinates: Coordinates) => void,
): MouseEventHandler<HTMLElement> {
    return useCallback((event) => {
        if (grid.contains(mouseCell)) {
            toggleCell(mouseCell);
        }
    }, [ref, mouseCell, grid, toggleCell]);
}

function useDrawCanvasEffect(
    ref: RefObject<HTMLCanvasElement>,
    grid: Grid,
    cellSizePixels: number,
    visibleCellBounds: Box2D,
    isDarkMode: boolean
) {
    useEffect(() => {
        const canvas = ref.current!;

        const ctx = canvas.getContext("2d")!;
        for (const { coordinates, isAlive } of grid.boundedIterator(visibleCellBounds)) {
            drawCell(ctx, coordinates, isAlive, isDarkMode, cellSizePixels);
        };
    }, [grid, cellSizePixels, visibleCellBounds, isDarkMode])
}

export default CanvasGameGrid;