import { range } from "lodash";
import { useEffect, useRef } from "react";
import { GameGridProps } from "../../grid/grid";

// TODO: Test it? Can I?
const cellSize = 20;
const CanvasGameGrid = ({ grid, className }: GameGridProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const y of range(0, grid.height)) {
            for (const x of range(0, grid.width)) {
                if (grid.get(x, y)) {
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                } else {
                    ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
    }, [grid])

    return (
        <canvas ref={canvasRef}
                id="canvas" 
                height={grid.height * cellSize} 
                width={grid.width * cellSize}
                className={`${className || ""}`}
        ></canvas>
    )
}

export default CanvasGameGrid;