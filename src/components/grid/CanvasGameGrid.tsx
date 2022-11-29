import { RefObject, useEffect, useMemo, useRef } from "react";
import { GameGridProps } from "../../grid/grid";
import { useMouseState, useMouseEvents } from "beautiful-react-hooks";
import { Scroll } from "../../types/scroll";
import { useDebounce, useWindowSize } from "usehooks-ts";
import { Box2D } from "../../util/box-2d";
import { benchmark } from "../../util/benchmark-function";

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

    const { clientX, clientY } = useMouseState(gridCanvasRef);
    const [clientCellX, clientCellY] = useMemo(() => {
        if (gridCanvasRef.current) {
            const [cellX, cellY] = getMouseCell(gridCanvasRef, clientX, clientY, cellSizePixels);
            return [cellX * cellSizePixels, cellY * cellSizePixels];
        } else {
            return [0, 0];
        }
    }, [gridCanvasRef, clientX, clientY, cellSize] );


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

    const { onMouseUp } = useMouseEvents(gridCanvasRef);
    const visibleBounds = useDebounce(useMemo<Box2D>(() => new Box2D(
        [scroll.left - windowSize.width, scroll.top - windowSize.height],
        [scroll.left + windowSize.width * 2, scroll.top + windowSize.height * 2],
    ), [windowSize, scroll, cellSizePixels]), 250);
    const visibleCellBounds = useMemo<Box2D>(
        () => visibleBounds.divide(cellSizePixels),
        [visibleBounds, cellSizePixels]
    );

    onMouseUp((event) => {
        // TODO: I broke this! It's not working
        const [x, y] = [event.clientX, event.clientY];
        const [cellX, cellY] = getMouseCell(gridCanvasRef, x, y, cellSizePixels);
        toggleCell([cellX, cellY]);
    });

    useEffect(() => {
        const canvas = gridCanvasRef.current!;

        const ctx = canvas.getContext("2d")!;
        benchmark("render", () => {
            for (const { coordinates: [x, y], isAlive } of grid.boundedIterator(visibleCellBounds)) {    
                if (isAlive) {
                    ctx.fillStyle = "black";
                } else {
                    ctx.fillStyle = "white";
                    ctx.strokeRect(x * cellSizePixels, y * cellSizePixels, cellSizePixels, cellSizePixels);
                }
                    ctx.fillRect(x * cellSizePixels, y * cellSizePixels, cellSizePixels, cellSizePixels);
            };
        })
    }, [grid, cellSizePixels, visibleCellBounds])


    return (
        <div style={{ position: "relative", height: "100vh" }}>
            <div style={{
                position: "absolute",
                height: `${cellSizePixels}px`,
                width: `${cellSizePixels}px`,
                backgroundColor: "red",
                top: clientCellY,
                left: clientCellX,
                zIndex: 10,
                opacity: 0.5
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

export default CanvasGameGrid;