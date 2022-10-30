
import useGrid from "../hooks/useGrid";
import Cell from "./Cell";

type GameGridProps = {
    height: number;
    width: number;
    birthFactor: number;
}

const GameGrid = (props: GameGridProps) => {
    const { get: grid } = useGrid(props.height, props.width, props.birthFactor)

    return (
        <div>
            { [...Array(props.height)].map((_, y) => (
                [...Array(props.width)].map((_, x) => (
                    x < (props.width-1) 
                    ? <Cell isAlive={grid(x, y)} aliveElement={<span>X</span>} deadElement={<span>O</span>} />
                    : <br/>
                ))
            ))}
        </div>
    )
}

GameGrid.defaultProps = {
    height: 10,
    width: 10,
    birthFactor: 0.2,
}

export default GameGrid