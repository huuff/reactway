
type GameSettingsProps = {
    readonly height: number;
    readonly width: number;
    readonly birthFactor: number;
};

const GameSettings = (props: GameSettingsProps) => {
    return (
        <div>
            <input type="number" name="height" value={props.height} />
            <input type="number" name="width" value={props.width} />
            <input type="number" name="birth-factor" value={props.birthFactor} />
        </div>
    )
}

export default GameSettings;