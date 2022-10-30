
import Cell from "./Cell";

type GameGridProps = {
    height: number;
    width: number;
}

const GameGrid = (props: GameGridProps) => {
    return (
        <div>
            {[...Array(props.height)].map((_, y) => (
                [...Array(props.width)].map((_, x) => (
                    x < (props.width-1) 
                    ? <Cell isAlive={true} aliveElement={<span>X</span>} deadElement={<span>O</span>} />
                    : <br/>
                ))
            ))}
        </div>
    )
}

GameGrid.defaultProps = {
    height: 10,
    width: 10,
}

export default GameGrid