
import { GameSettings } from "./Game";

const GameSettingsView = (props: GameSettings & { className: string }) => {
    return (
        <div className={`${props.className} flex-col items-stretch`}>

            <label className="block">
                <span className="mr-2">Height:</span>
                <input type="number" name="height" value={props.height}/>
            </label>

            <label className="block">
                <span className="mr-2">Width:</span>
                <input type="number" name="width" value={props.width} />
            </label>


            <label className="block">
                <span className="mr-2">Birth Factor:</span>
                <input type="number" name="birth-factor" value={props.birthFactor} />
            </label>

        </div>
    )
}

export default GameSettingsView;