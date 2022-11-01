
import { GameSettings } from "./Game";

const GameSettingsView = (props: GameSettings & { className: string }) => {
    return (
        <div className={props.className}>

            <div className="flex justify-between">
                <label htmlFor="height" className="w-1/2 mr-2">Height:</label>
                <input type="number" name="height" value={props.height} className="w-1/4"/>
            </div>

            <div className="flex justify-between">
                <label htmlFor="width" className="w-1/2 mr-2">Width:</label>
                <input type="number" name="width" value={props.width} className="w-1/4"/>
            </div>


            <div className="flex justify-between">
                <label htmlFor="birth-factor" className="w-1/2 mr-2">Birth Factor:</label>
                <input type="number" name="birth-factor" value={props.birthFactor} className="w-1/4"/>
            </div>

        </div>
    )
}

export default GameSettingsView;