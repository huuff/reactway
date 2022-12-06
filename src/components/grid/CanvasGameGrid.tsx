import { MouseEventHandler, RefObject, useCallback, useEffect, useMemo, useRef } from "react";
import { Coordinates, GameGridProps, Grid } from "../../grid/grid";
import { useMouseState, usePreviousValue, useViewportState } from "beautiful-react-hooks";
import { useDarkMode, useDebounce } from "usehooks-ts";
import { Box2D } from "../../util/box-2d";
import tuple from "immutable-tuple";
import { useIsDragging } from "../../util/use-is-dragging";
import theme from "../../../theme";

const CELL_SIZE_MULTIPLIER = 8;

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
    cellSizePixels: number,
    drawInsideOnly = false, // Only draw in the inside of the cell, not the whole of it
) {
    const rectSizePixels = drawInsideOnly ? cellSizePixels - 1 : cellSizePixels;

    const [x, y] = coordinates;
    if (isAlive) {
        canvasContext.fillStyle = isDarkMode ? theme.dark.aliveCell : theme.light.aliveCell;
    } else {
        canvasContext.fillStyle = isDarkMode ? theme.dark.deadCell : theme.light.deadCell;
        canvasContext.strokeStyle
        canvasContext.strokeRect(x * cellSizePixels, y * cellSizePixels, rectSizePixels, rectSizePixels);
    }
    canvasContext.fillRect(x * cellSizePixels, y * cellSizePixels, rectSizePixels, rectSizePixels);
}

// TODO: Test it? Can I?
const CanvasGameGrid = ({
    grid,
    className,
    toggleCell,
    cellSize,
}: GameGridProps) => {
    const { isDarkMode } = useDarkMode();
    const cellSizePixels = useMemo(() => CELL_SIZE_MULTIPLIER * cellSize, [cellSize]);
    const gridCanvasRef = useRef<HTMLCanvasElement>(null);

    const { width: windowWidth, height: windowHeight } = useViewportState();

    const gridSizePixels = useMemo(() => ({
        width: grid.width * cellSizePixels,
        height: grid.height * cellSizePixels,
    }), [grid.height, grid.width, cellSizePixels]);

    const visibleCellBounds = useVisibleBounds(gridCanvasRef, windowWidth, windowHeight, gridSizePixels, cellSizePixels)

    useDrawCanvasEffect(gridCanvasRef, grid, cellSizePixels, visibleCellBounds, isDarkMode);

    const hoveredCell = useDebounce(useHoveredCell(grid.width, grid.height, gridCanvasRef, cellSizePixels), 5);
    const previousHoveredCell = usePreviousValue(hoveredCell);
    const isMouseWithinGrid = useIsMouseWithinGrid(gridCanvasRef);

    const isDragging = useIsDragging();
    useDrawHighlightedCellEffect({
        grid,
        gridCanvasRef,
        hoveredCell,
        previousHoveredCell,
        cellSizePixels,
        isDarkMode,
        isMouseWithinGrid,
        isDragging,
    });

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
    gridCanvasRef: RefObject<HTMLCanvasElement>,
    windowWidth: number,
    windowHeight: number,
    gridSizePixels: Size,
    cellSizePixels: number
): Box2D {
    const { top, left } = getBoundingRectOrZeros(gridCanvasRef);
    const visibleBounds = useDebounce(useMemo<Box2D>(() => new Box2D(
        tuple(
            Math.max(-left - (windowWidth / 2), 0),
            Math.max(-top - (windowHeight / 2), 0)
        ),
        tuple(
            Math.min(-left + (windowWidth * 1.5), gridSizePixels.width),
            Math.min(-top + (windowHeight * 1.5), gridSizePixels.height),
        ),
    ), [windowHeight, windowWidth, top, left, gridSizePixels]), 250);
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

type HighlightedCellEffectParams = {
    grid: Grid,
    gridCanvasRef: RefObject<HTMLCanvasElement>,
    hoveredCell: Coordinates,
    previousHoveredCell: Coordinates,
    isDarkMode: boolean,
    cellSizePixels: number,
    isMouseWithinGrid: boolean,
    isDragging: boolean,
}
// XXX: This still leaves a trail of cells with a stroke that looks thicker than the rest...
// but that's much nicer than what I had before, so I'm leaving it so for now.

// TODO: Disable when ticking is getting slow
function useDrawHighlightedCellEffect({
    grid,
    gridCanvasRef,
    hoveredCell,
    previousHoveredCell,
    isDarkMode,
    cellSizePixels,
    isMouseWithinGrid,
    isDragging,
}: HighlightedCellEffectParams) {
    useEffect(() => {
        if (isDragging) {
            // We don't want this effect to run when dragging (i.e. when moving the grid)
            // because that's already slow enoug for large grids, and besides, it doesn't really add much there
            return;
        }

        const canvas = gridCanvasRef.current!;

        const ctx = canvas.getContext("2d")!;
        // First, cleanup the previously hovered cell
        if (previousHoveredCell) {
            const isPreviousAlive = grid.get(previousHoveredCell);
            drawCell(ctx, previousHoveredCell, isPreviousAlive, isDarkMode, cellSizePixels, true);
        }

        if (!isMouseWithinGrid) {
            // The mouse is outside the grid, so it doesn't make sense to paint any hovered cell
            return;
        }

        // Then, we paint the currently hovered cell
        const isAlive = grid.get(hoveredCell);
        const [x, y] = hoveredCell;

        // TODO: Merge this with the drawcell function?
        if (isAlive) {
            ctx.fillStyle = "#660000";
        } else {
            ctx.fillStyle = isDarkMode ? "#B30000" : "#FF3333";
        }
        ctx.fillRect(x * cellSizePixels, y * cellSizePixels, cellSizePixels-1, cellSizePixels-1);

    }, [hoveredCell, previousHoveredCell, grid, isMouseWithinGrid, isDarkMode, isDragging])
}

export default CanvasGameGrid;