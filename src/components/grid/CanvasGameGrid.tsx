import { RefObject, useEffect, useRef } from "react";
import { GameGridProps } from "../../grid/grid";
import { useMouseState, useMouseEvents } from "beautiful-react-hooks";
import { useDebounce } from "usehooks-ts";


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
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { clientX, clientY } = useDebounce(useMouseState(canvasRef), 5);
    const { onMouseUp } = useMouseEvents(canvasRef);

    onMouseUp((event) => {
        const [x, y] = [event.clientX, event.clientY];
        const [cellX, cellY] = getMouseCell(canvasRef, x, y);
        toggleCell([cellX, cellY]);
    })

    useEffect(() => {
        const canvas = canvasRef.current!;

        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Paint the whole grid
        ctx.fillStyle = "black";
        for (const {coordinates: [x, y], isAlive} of grid) {
            if (isAlive) {
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            } else {
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        };

        // Paint the hovered cell
        const [mouseCellX, mouseCellY] = getMouseCell(canvasRef, clientX, clientY);
        if (grid.get(mouseCellX, mouseCellY)) {
            ctx.fillStyle = "#800000";
        } else {
            ctx.fillStyle = "#ff4d4d";
        }
        ctx.fillRect(mouseCellX * cellSize, mouseCellY * cellSize, cellSize, cellSize);

    }, [grid, clientX, clientY])


    return (
        <>
            <canvas ref={canvasRef}
                id="canvas"
                height={grid.height * cellSize}
                width={grid.width * cellSize}
                className={`${className || ""}`}
            ></canvas>
        </>
    )
}

export default CanvasGameGrid;