import { range } from "lodash";
import { useEffect, useRef } from "react";
import { GameGridProps } from "../../grid/grid";
import { useMouseState } from "beautiful-react-hooks";


const cellSize = 20;

function calculateBoundingCell([x, y]: [number, number]): [number, number] {
    return [
        (x - (x % cellSize)) / cellSize,
        (y - (y % cellSize)) / cellSize,
    ]
}

// TODO: Test it? Can I?
// TODO: Implement toggle
const CanvasGameGrid = ({ grid, className, toggle }: GameGridProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { clientX, clientY } = useMouseState(canvasRef);


    useEffect(() => {
        const canvas = canvasRef.current!;

        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Paint the whole grid
        ctx.fillStyle = "black";
        for (const y of range(0, grid.height)) {
            for (const x of range(0, grid.width)) {
                if (grid.get(x, y)) {
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                } else {
                    ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }

        // Paint the hovered cell
        const boundingRect = canvas.getBoundingClientRect();
        const mouseCoords: [number, number] = [clientX - boundingRect.left, clientY - boundingRect.top]
        const [mouseCellX, mouseCellY] = calculateBoundingCell(mouseCoords);
        if (grid.get(mouseCellX, mouseCellY)) {
            ctx.fillStyle = "#800000";
        } else {
            ctx.fillStyle = "#ff4d4d";
        }
        ctx.fillRect(mouseCellX * cellSize, mouseCellY * cellSize, cellSize, cellSize);

    }, [grid, clientX, clientY])

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;


    }, [grid])

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