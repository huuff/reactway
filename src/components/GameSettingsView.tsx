
import { GameSettings } from "./Game";

const GameSettingsView = (props: GameSettings & { className: string }) => {
    return (
        <div className={props.className}>
            <input type="number" name="height" value={props.height} />
            <input type="number" name="width" value={props.width} />
            <input type="number" name="birth-factor" value={props.birthFactor} />
        </div>
    )
}

export default GameSettingsView;