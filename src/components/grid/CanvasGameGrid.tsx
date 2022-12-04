import { CSSProperties, MouseEventHandler, RefObject, useCallback, useEffect, useMemo, useRef } from "react";
import { Coordinates, GameGridProps, Grid } from "../../grid/grid";
import { useMouseState, useViewportState } from "beautiful-react-hooks";
import { useDarkMode, useDebounce, useTernaryDarkMode } from "usehooks-ts";
import { Box2D } from "../../util/box-2d";
import tuple from "immutable-tuple";

const CELL_SIZE_MULTIPLIER = 8;

type CanvasGameGridProps = GameGridProps & {
    scrollX: number;
    scrollY: number;
};
type Size = {
    width: number;
    height: number;
}

// TODO: Test it? Can I?
const CanvasGameGrid = ({ grid, className, toggleCell, cellSize, scrollX, scrollY }: CanvasGameGridProps) => {
    const { isDarkMode } = useDarkMode();
    const cellSizePixels = useMemo(() => CELL_SIZE_MULTIPLIER * cellSize, [cellSize]);
    const gridCanvasRef = useRef<HTMLCanvasElement>(null);

    const [clientCellX, clientCellY] = useMouseCell(gridCanvasRef, cellSizePixels);
    const { width: windowWidth, height: windowHeight } = useViewportState();
    const { sizePixels: gridSizePixels, style: gridCanvasStyle } = useGridStyle(grid, cellSizePixels, windowWidth);

    const visibleCellBounds = useVisibleBounds(windowWidth, windowHeight, scrollX, scrollY, gridSizePixels, cellSizePixels)
    const onMouseUp = useClickToggleHandler(gridCanvasRef, cellSizePixels, grid, toggleCell);

    useDrawCanvasEffect(gridCanvasRef, grid, cellSizePixels, visibleCellBounds, isDarkMode);


    return (
        <div style={{ position: "relative", height: "100vh" }} onMouseUp={onMouseUp} >
            <div style={{
                position: "absolute",
                height: `${cellSizePixels}px`,
                width: `${cellSizePixels}px`,
                backgroundColor: "red",
                top: clientCellY,
                left: clientCellX,
                zIndex: 10,
                opacity: 0.5,

            }} />
            <canvas ref={gridCanvasRef}
                id="grid-canvas"
                height={gridSizePixels.height}
                width={gridSizePixels.width}
                className={`${className || ""}`}
                style={gridCanvasStyle}
            ></canvas>
        </div>
    )
}

function getMouseCell(
    canvas: RefObject<HTMLCanvasElement>,
    clientX: number,
    clientY: number,
    cellSize: number,
): [number, number] {
    const boundingRect = canvas.current!.getBoundingClientRect();
    const [x, y]: [number, number] = [clientX - (boundingRect.left < 0 ? boundingRect.left : 0), clientY - boundingRect.top]

    return [
        (x - (x % cellSize)) / cellSize,
        (y - (y % cellSize)) / cellSize,
    ]
}

function useMouseCell(gridCanvasRef: RefObject<HTMLCanvasElement>, cellSizePixels: number): [number, number] {
    const { clientX, clientY } = useMouseState(gridCanvasRef);
    const [clientCellX, clientCellY] = useMemo(() => {
        if (gridCanvasRef.current) {
            const [cellX, cellY] = getMouseCell(gridCanvasRef, clientX, clientY, cellSizePixels);
            return [cellX * cellSizePixels, cellY * cellSizePixels];
        } else {
            return [0, 0];
        }
    }, [gridCanvasRef, clientX, clientY, cellSizePixels]);

    return [clientCellX, clientCellY];
}

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

function useGridStyle(
    grid: Grid,
    cellSizePixels: number,
    windowWidth: number,
): { sizePixels: Size, style: CSSProperties } {
    const gridSizePixels = useMemo(() => ({
        width: grid.width * cellSizePixels,
        height: grid.height * cellSizePixels,
    }), [grid.height, grid.width, cellSizePixels]);
    const gridCanvasStyle = useMemo(() => ({
        position: "absolute" as const,
        left: gridSizePixels.width < windowWidth ? "50%" : undefined,
        transform: gridSizePixels.width < windowWidth ? "translate(-50%)" : undefined,
    }), [gridSizePixels, windowWidth]);

    return {
        sizePixels: gridSizePixels,
        style: gridCanvasStyle,
    };
}

function useClickToggleHandler(
    ref: RefObject<HTMLCanvasElement>,
    cellSizePixels: number,
    grid: Grid,
    toggleCell: (coordinates: Coordinates) => void,
): MouseEventHandler<HTMLElement> {
    return useCallback((event) => {
        const [x, y] = [event.clientX, event.clientY];
        const [cellX, cellY] = getMouseCell(ref, x, y, cellSizePixels);
        const transformedCellX = cellX - Math.floor((ref.current?.getBoundingClientRect().left ?? 0) / cellSizePixels);
        if (grid.contains(tuple(transformedCellX, cellY))) {
            toggleCell(tuple(transformedCellX, cellY));
        }
    }, [cellSizePixels, grid, toggleCell]);
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