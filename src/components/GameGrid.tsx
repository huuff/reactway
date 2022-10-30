
type GameGridProps = {
    height: number;
    width: number;
}

function GameGrid(props: GameGridProps) {
    return (
        <div>
            {[...Array(props.height)].map((_, y) => (
                [...Array(props.width)].map((_, x) => (
                    x < (props.width-1) ? <span>X</span> : <br/>
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