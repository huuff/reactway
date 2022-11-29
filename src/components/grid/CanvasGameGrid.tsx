import { RefObject, useEffect, useMemo, useRef } from "react";
import { GameGridProps } from "../../grid/grid";
import { useMouseState, useMouseEvents } from "beautiful-react-hooks";
import { Scroll } from "../../types/scroll";
import { useDebounce, useWindowSize } from "usehooks-ts";
import { Box2D } from "../../util/box-2d";

const CELL_SIZE_MULTIPLIER = 8;

type CanvasGameGridProps = GameGridProps & {
    scroll: Scroll;
}

function getMouseCell(
    canvas: RefObject<HTMLCanvasElement>,
    clientX: number,
    clientY: number,
    cellSize: number,
): [number, number] {
    const boundingRect = canvas.current!.getBoundingClientRect();
    const [x, y]: [number, number] = [clientX - boundingRect.left, clientY - boundingRect.top]

    return [
        (x - (x % cellSize)) / cellSize,
        (y - (y % cellSize)) / cellSize,
    ]
}

// TODO: Test it? Can I?
// TODO: Split this in some separate hooks
const CanvasGameGrid = ({ grid, className, toggleCell, cellSize, scroll }: CanvasGameGridProps) => {
    const cellSizePixels = useMemo(() => CELL_SIZE_MULTIPLIER * cellSize, [cellSize]);

    const gridCanvasRef = useRef<HTMLCanvasElement>(null);

    const mouseCanvasRef = useRef<HTMLCanvasElement>(null);
    const { clientX, clientY } = useMouseState(mouseCanvasRef);
    const { onMouseUp } = useMouseEvents(mouseCanvasRef);

    const windowSize = useWindowSize();
    const gridSizePixels = useMemo(() => ({
        width: grid.width * cellSizePixels,
        height: grid.height * cellSizePixels,
    }), [grid.height, grid.width, cellSizePixels]);
    const gridCanvasStyle = useMemo(() => ({
        position: "absolute" as const, 
        left: gridSizePixels.width < windowSize.width ? "50%" : undefined,
        transform: gridSizePixels.width < windowSize.width ? "translate(-50%)" : undefined,
    }), [gridSizePixels, windowSize]);

    const visibleBounds = useDebounce(useMemo<Box2D>(() => new Box2D(
        [scroll.left - windowSize.width, scroll.top - windowSize.height ],
        [scroll.left + windowSize.width * 2, scroll.top + windowSize.height * 2],
    ), [windowSize, scroll, cellSizePixels]), 250);
    const visibleCellBounds = useMemo<Box2D>(
        () =>  visibleBounds.divide(cellSizePixels), 
        [visibleBounds, cellSizePixels]
    );

    onMouseUp((event) => {
        const [x, y] = [event.clientX, event.clientY];
        const [cellX, cellY] = getMouseCell(mouseCanvasRef, x, y, cellSizePixels);
        toggleCell([cellX, cellY]);
    });

    useEffect(() => {
        const canvas = mouseCanvasRef.current!;

        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(
            visibleBounds.topLeft[0], 
            visibleBounds.topLeft[1], 
            visibleBounds.bottomRight[0], 
            visibleBounds.bottomRight[1]
        );

        // Paint the hovered cell
        const [mouseCellX, mouseCellY] = getMouseCell(gridCanvasRef, clientX, clientY, cellSizePixels);
        if (!grid.contains(mouseCellX, mouseCellY)) {
            return;
        }

        if (grid.get(mouseCellX, mouseCellY)) {
            ctx.fillStyle = "#800000";
        } else {
            ctx.fillStyle = "#ff4d4d";
        }
        ctx.fillRect(
            mouseCellX * cellSizePixels,
            mouseCellY * cellSizePixels,
            cellSizePixels,
            cellSizePixels
        );

    }, [grid, clientX, clientY, visibleCellBounds]);

    useEffect(() => {
        const canvas = gridCanvasRef.current!;

        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(
            visibleBounds.topLeft[0], 
            visibleBounds.topLeft[1], 
            visibleBounds.bottomRight[0], 
            visibleBounds.bottomRight[1]
        );

        // Paint the whole grid
        ctx.fillStyle = "black";
        for (const { coordinates: [x, y], isAlive } of grid) {
            if (!visibleCellBounds.contains([x, y]))
                continue;

            if (isAlive) {
                ctx.fillRect(x * cellSizePixels, y * cellSizePixels, cellSizePixels, cellSizePixels);
            } else {
                ctx.strokeRect(x * cellSizePixels, y * cellSizePixels, cellSizePixels, cellSizePixels);
            }
        };
    }, [grid, cellSizePixels, visibleCellBounds])


    return (
        <div style={{ position: "relative", height: "100vh" }}>
            <canvas ref={mouseCanvasRef}
                id="mouse-canvas"
                height={gridSizePixels.height}
                width={gridSizePixels.width}
                className={`${className || ""}`}
                style={{ ...gridCanvasStyle, zIndex: 10 }}
            ></canvas>
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

export default CanvasGameGrid;