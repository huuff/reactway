import { CSSProperties, MouseEventHandler, RefObject, useCallback, useEffect, useMemo, useRef } from "react";
import { Coordinates, GameGridProps, Grid } from "../../grid/grid";
import { useMouseState, useViewportState } from "beautiful-react-hooks";
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
    return ref.current?.getBoundingClientRect() ?? { left: 0, top: 0, right: 0, bottom: 0};
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

    const visibleCellBounds = useVisibleBounds(windowWidth, windowHeight, scrollX, scrollY, gridSizePixels, cellSizePixels)

    useDrawCanvasEffect(gridCanvasRef, grid, cellSizePixels, visibleCellBounds, isDarkMode);

    const hoveredCell = useHoveredCell(grid.width, grid.height, gridCanvasRef, cellSizePixels);
    const onMouseUp = useClickToggleHandler(gridCanvasRef, hoveredCell, grid, toggleCell);

    const highlightedCell = useHighlightedCell(gridCanvasRef, cellSizePixels, hoveredCell);

    const isMouseWithinGrid = useIsMouseWithinGrid(gridCanvasRef);

    return (
        <div onMouseUp={onMouseUp} className={className}>
            { isMouseWithinGrid && (
            <div style={{
                position: "absolute",
                height: `${cellSizePixels}px`,
                width: `${cellSizePixels}px`,
                backgroundColor: "red",
                left: highlightedCell[0],
                top: highlightedCell[1],
                zIndex: 10,
                opacity: 0.5,
            }} />
            )}
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

    return clientX >= left && clientX  <= right && clientY >= top && clientY <= bottom;
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
 * Returns coordinates that match the position of the highlighted cell in the screen,
 * taking into account all displacements and transformations
 */
const useHighlightedCell = (
    gridCanvasRef: RefObject<HTMLCanvasElement>, 
    cellSizePixels: number,
    [hoveredCellX, hoveredCellY]: Coordinates
    ): Coordinates => {

    const { left: leftDisplacement, top } = getBoundingRectOrZeros(gridCanvasRef);

    const topDisplacement = Math.max(top, 0);

    const coordinates = tuple(
        (hoveredCellX * cellSizePixels) + leftDisplacement,
        (hoveredCellY * cellSizePixels) + topDisplacement,
    );

    return coordinates;
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
    const { width: viewportWidth, height: viewportHeight } = useViewportState();

    const { left: leftDisplacement, top, } = getBoundingRectOrZeros(gridCanvasRef);

    const gridDisplacementToTheBottom = Math.max(top, 0);

    const mouseX = Math.max(0, clientX - leftDisplacement)
    const mouseY = Math.max(0, clientY - gridDisplacementToTheBottom)

    const result = tuple(
        Math.min(Math.floor((mouseX - (mouseX % cellSizePixels)) / cellSizePixels), gridWidth-1),
        Math.min(Math.floor((mouseY - (mouseY % cellSizePixels)) / cellSizePixels), gridHeight-1),
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
        for (const { coordinates: [x, y], isAlive } of grid.boundedIterator(visibleCellBounds)) {
            if (isAlive) {
                ctx.fillStyle = isDarkMode ? "#262626" : "#000000";
            } else {
                ctx.fillStyle = isDarkMode ? "#666666" : "#F0F0F0";
                ctx.strokeRect(x * cellSizePixels, y * cellSizePixels, cellSizePixels, cellSizePixels);
            }
            ctx.fillRect(x * cellSizePixels, y * cellSizePixels, cellSizePixels, cellSizePixels);
        };
    }, [grid, cellSizePixels, visibleCellBounds, isDarkMode])
}

export default CanvasGameGrid;