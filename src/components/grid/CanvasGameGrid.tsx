import { RefObject, useEffect, useMemo, useRef } from "react";
import { GameGridProps } from "../../grid/grid";
import { useMouseState, useMouseEvents } from "beautiful-react-hooks";
import { Scroll } from "../../types/scroll";

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
const CanvasGameGrid = ({ grid, className, toggleCell, cellSize, scroll }: CanvasGameGridProps) => {
    const cellSizePixels = useMemo(() => CELL_SIZE_MULTIPLIER * cellSize, [cellSize]);

    const gridCanvasRef = useRef<HTMLCanvasElement>(null);

    const mouseCanvasRef = useRef<HTMLCanvasElement>(null);
    const { clientX, clientY } = useMouseState(mouseCanvasRef);
    const { onMouseUp } = useMouseEvents(mouseCanvasRef);

    onMouseUp((event) => {
        const [x, y] = [event.clientX, event.clientY];
        const [cellX, cellY] = getMouseCell(mouseCanvasRef, x, y, cellSizePixels);
        toggleCell([cellX, cellY]);
    });

    useEffect(() => {
        const canvas = mouseCanvasRef.current!;

        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    }, [grid, clientX, clientY, cellSizePixels]);

    useEffect(() => {
        const canvas = gridCanvasRef.current!;

        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Paint the whole grid
        ctx.fillStyle = "black";
        for (const { coordinates: [x, y], isAlive } of grid) {
            if (isAlive) {
                ctx.fillRect(x * cellSizePixels, y * cellSizePixels, cellSizePixels, cellSizePixels);
            } else {
                ctx.strokeRect(x * cellSizePixels, y * cellSizePixels, cellSizePixels, cellSizePixels);
            }
        };
    }, [grid, cellSizePixels])


    return (
            <div style={{ position: "relative", height: "100vh" }}>
                <canvas ref={mouseCanvasRef}
                    id="mouse-canvas"
                    height={grid.height * cellSizePixels}
                    width={grid.width * cellSizePixels}
                    className={`${className || ""}`}
                    style={{ position: "absolute", zIndex: 10, left: "50%", transform: "translate(-50%)"}}
                ></canvas>
                <canvas ref={gridCanvasRef}
                    id="grid-canvas"
                    height={grid.height * cellSizePixels}
                    width={grid.width * cellSizePixels}
                    className={`${className || ""}`}
                    style={{ position: "absolute", left: "50%", transform: "translate(-50%)" }}
                ></canvas>
        </div>
    )
}

export default CanvasGameGrid;