import { MouseEventHandler, RefObject, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { Coordinates, GameGridProps, Grid } from "../../grid/grid";
import { useMouseState, usePreviousValue, useViewportState } from "beautiful-react-hooks";
import { useDarkMode, useDebounce } from "usehooks-ts";
import { Box2D } from "../../util/box-2d";
import tuple from "immutable-tuple";
import { useIsDragging } from "../../hooks/use-is-dragging";
import { getTheme, LiveStatusDependent, ClassAndColor } from "../../util/get-theme";
import { PerformanceTracker, PerformanceTrackerContext } from "../../hooks/use-performance-tracker";
import { benchmark } from "../../util/benchmark-function";

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
    cellSizePixels: number,
    colors: LiveStatusDependent<ClassAndColor>,
    drawInsideOnly = false, // Only draw in the inside of the cell, not the whole of it
) {
    const rectSizePixels = drawInsideOnly ? cellSizePixels - 1 : cellSizePixels;

    const [x, y] = coordinates;
    if (isAlive) {
        canvasContext.fillStyle = colors.alive.color
    } else {
        canvasContext.fillStyle = colors.dead.color;
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
    innerRef,
}: GameGridProps) => {
    const { isDarkMode } = useDarkMode();
    const cellSizePixels = useMemo(() => CELL_SIZE_MULTIPLIER * cellSize, [cellSize]);
    const gridCanvasRef = useRef<HTMLCanvasElement>(null);

    const windowSize = useViewportState();

    const gridSizePixels = useMemo(() => ({
        width: grid.width * cellSizePixels,
        height: grid.height * cellSizePixels,
    }), [grid.height, grid.width, cellSizePixels]);
    const performanceTracker = useContext(PerformanceTrackerContext);

    const visibleAreaMultiplier = useMemo(() => {
        if (!performanceTracker.isDisabled("visible")) {
            return 2;
        } else {
            return 1;
        }
    }, [performanceTracker]);
    const visibleCellBounds = useVisibleBounds(
            gridCanvasRef,
            windowSize, 
            gridSizePixels, 
            cellSizePixels, 
            visibleAreaMultiplier
    );

    useDrawCanvasEffect(gridCanvasRef, grid, cellSizePixels, visibleCellBounds, isDarkMode, performanceTracker);

    const isDragging = useIsDragging();
    const isMouseWithinGrid = useIsMouseWithinGrid(gridCanvasRef);
    const hoveredCell = useDebounce(useHoveredCell(grid, gridCanvasRef, cellSizePixels, isMouseWithinGrid, isDragging), 5);
    const previousHoveredCell = usePreviousValue(hoveredCell);

    useDrawHighlightedCellEffect({ 
        grid,
        gridCanvasRef,
        hoveredCell,
        previousHoveredCell,
        cellSizePixels,
        isDarkMode,
        performanceTracker,
    });

    const onMouseUp = useClickToggleHandler(hoveredCell, grid, toggleCell);

    return (
        <div onMouseUp={onMouseUp} className={className} ref={innerRef}>
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
    windowSize: Size,
    gridSizePixels: Size,
    cellSizePixels: number,
    visibleAreaMultiplier: number,
): Box2D {
    const { top, left } = getBoundingRectOrZeros(gridCanvasRef);
    const visibleBounds = useDebounce(useMemo<Box2D>(() => new Box2D(
        tuple(
            Math.max(-left - (windowSize.width * visibleAreaMultiplier), 0),
            Math.max(-top - (windowSize.height * visibleAreaMultiplier), 0)
        ),
        tuple(
            Math.min(-left + (windowSize.width * visibleAreaMultiplier), gridSizePixels.width),
            Math.min(-top + (windowSize.height * visibleAreaMultiplier), gridSizePixels.height),
        ),
    ), [windowSize.height, windowSize.width, top, left, gridSizePixels, visibleAreaMultiplier]), 250);
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
    gridSize: Size,
    gridCanvasRef: RefObject<HTMLCanvasElement>,
    cellSizePixels: number,
    isMouseWithinGrid: boolean,
    isDragging: boolean,
): Coordinates | null => {
    const { clientX, clientY } = useMouseState();

    if (isDragging || !isMouseWithinGrid) {
        return null;
    }

    const { left: leftDisplacement, top: topDisplacement, } = getBoundingRectOrZeros(gridCanvasRef);

    const mouseX = Math.max(0, clientX - leftDisplacement)
    const mouseY = Math.max(0, clientY - topDisplacement)

    const result = tuple(
        Math.min(Math.floor((mouseX - (mouseX % cellSizePixels)) / cellSizePixels), gridSize.width - 1),
        Math.min(Math.floor((mouseY - (mouseY % cellSizePixels)) / cellSizePixels), gridSize.height - 1),
    );

    return result;
}

function useClickToggleHandler(
    mouseCell: Coordinates | null,
    grid: Grid,
    toggleCell: (coordinates: Coordinates) => void,
): MouseEventHandler<HTMLElement> {
    return useCallback((event) => {
        if (mouseCell && grid.contains(mouseCell)) {
            toggleCell(mouseCell);
        }
    }, [mouseCell, grid, toggleCell]);
}

function useDrawCanvasEffect(
    ref: RefObject<HTMLCanvasElement>,
    grid: Grid,
    cellSizePixels: number,
    visibleCellBounds: Box2D,
    isDarkMode: boolean,
    performanceTracker: PerformanceTracker,
) {
    useEffect(() => {
        const { elapsedMs } = benchmark(() => {
            const canvas = ref.current!;

            const ctx = canvas.getContext("2d")!;
            for (const { coordinates, isAlive } of grid.boundedIterator(visibleCellBounds)) {
                drawCell(ctx, coordinates, isAlive, cellSizePixels, getTheme(isDarkMode).cell);
            };
        })
        
        performanceTracker.recordSample(elapsedMs, new Date());
    }, [ref, grid, cellSizePixels, visibleCellBounds, isDarkMode])
}

type HighlightedCellEffectParams = {
    grid: Grid,
    gridCanvasRef: RefObject<HTMLCanvasElement>,
    hoveredCell: Coordinates | null,
    previousHoveredCell: Coordinates | null,
    isDarkMode: boolean,
    cellSizePixels: number,
    performanceTracker: PerformanceTracker,
}
// XXX: This still leaves a trail of cells with a stroke that looks thicker than the rest...
// but that's much nicer than what I had before, so I'm leaving it so for now.

function useDrawHighlightedCellEffect({
    grid,
    gridCanvasRef,
    hoveredCell,
    previousHoveredCell,
    isDarkMode,
    cellSizePixels,
    performanceTracker,
}: HighlightedCellEffectParams) {
    useEffect(() => {
        // Not working when ticking is slow
        if (performanceTracker.isDisabled("hover")) {
            return;
        }

        const canvas = gridCanvasRef.current!;

        const ctx = canvas.getContext("2d")!;
        // First, cleanup the previously hovered cell
        if (previousHoveredCell) {
            const isPreviousAlive = grid.get(previousHoveredCell);
            drawCell(ctx, previousHoveredCell, isPreviousAlive, cellSizePixels, getTheme(isDarkMode).cell, true);
        }

        // Then, we paint the currently hovered cell
        if (hoveredCell) {
            const isAlive = grid.get(hoveredCell);
        
            drawCell(ctx, hoveredCell, isAlive, cellSizePixels, getTheme(isDarkMode).cell.hovered, true);
        }

    }, [cellSizePixels, gridCanvasRef, performanceTracker, hoveredCell, previousHoveredCell, grid, isDarkMode])
}

export default CanvasGameGrid;