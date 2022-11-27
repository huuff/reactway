import { RefObject, useEffect, useRef } from "react";
import { GameGridProps } from "../../grid/grid";
import { useMouseState, useMouseEvents } from "beautiful-react-hooks";

const cellSize = 20;

function getMouseCell(
    canvas: RefObject<HTMLCanvasElement>,
    clientX: number,
    clientY: number
): [number, number] {
    const boundingRect = canvas.current!.getBoundingClientRect();
    const [x, y]: [number, number] = [clientX - boundingRect.left, clientY - boundingRect.top]

    return [
        (x - (x % cellSize)) / cellSize,
        (y - (y % cellSize)) / cellSize,
    ]
}

// TODO: Test it? Can I?
// TODO: Try to render a transparent grid on top of the real one to show the hovered cell
// without rerendering the whole grid on each cursor movement?
const CanvasGameGrid = ({ grid, className, toggleCell }: GameGridProps) => {
    const gridCanvasRef = useRef<HTMLCanvasElement>(null);

    const mouseCanvasRef = useRef<HTMLCanvasElement>(null);
    const { clientX, clientY } = useMouseState(mouseCanvasRef);
    const { onMouseUp } = useMouseEvents(mouseCanvasRef);

    onMouseUp((event) => {
        const [x, y] = [event.clientX, event.clientY];
        const [cellX, cellY] = getMouseCell(mouseCanvasRef, x, y);
        toggleCell([cellX, cellY]);
    });

    useEffect(() => {
        const canvas = mouseCanvasRef.current!;

        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Paint the hovered cell
        const [mouseCellX, mouseCellY] = getMouseCell(gridCanvasRef, clientX, clientY);
        if (grid.get(mouseCellX, mouseCellY)) {
            ctx.fillStyle = "#800000";
        } else {
            ctx.fillStyle = "#ff4d4d";
        }
        ctx.fillRect(mouseCellX * cellSize, mouseCellY * cellSize, cellSize, cellSize);

    }, [clientX, clientY]);

    useEffect(() => {
        const canvas = gridCanvasRef.current!;

        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Paint the whole grid
        ctx.fillStyle = "black";
        for (const { coordinates: [x, y], isAlive } of grid) {
            if (isAlive) {
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            } else {
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        };
    }, [grid])


    return (
            <div style={{ position: "relative", height: "100vh" }}>
                <canvas ref={mouseCanvasRef}
                    id="mouse-canvas"
                    height={grid.height * cellSize}
                    width={grid.width * cellSize}
                    className={`${className || ""}`}
                    style={{ position: "absolute", zIndex: 10, left: "50%", transform: "translate(-50%)"}}
                ></canvas>
                <canvas ref={gridCanvasRef}
                    id="grid-canvas"
                    height={grid.height * cellSize}
                    width={grid.width * cellSize}
                    className={`${className || ""}`}
                    style={{ position: "absolute", left: "50%", transform: "translate(-50%)" }}
                ></canvas>
        </div>
    )
}

export default CanvasGameGrid;