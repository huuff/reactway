import { ChangeEvent } from "react";
import { GameSettings, GameSettingsAction, GameSettingsActionType } from "../game/settings";

type GameSettingsViewProps = {
    settings: GameSettings,
    dispatchSettings: React.Dispatch<GameSettingsAction>
}

const GameSettingsView = (props: GameSettingsViewProps & { className: string }) => {
    function createSettingsChangeHandler(eventType: GameSettingsActionType) {
        return (e: ChangeEvent<HTMLInputElement>) => {
            props.dispatchSettings({
                type: eventType,
                value: +e.target.value,
            })
        }
    }

    return (
        <div className={props.className}>

            <div className="flex justify-between">
                <label htmlFor="height" className="w-1/2 mr-2">Height:</label>
                <input 
                    className="w-1/4"
                    type="number" 
                    name="height" 
                    min="0"
                    max="50"
                    value={props.settings.height} 
                    onChange={createSettingsChangeHandler("setHeight")}
                />
            </div>

            <div className="flex justify-between">
                <label htmlFor="width" className="w-1/2 mr-2">Width:</label>
                <input
                    className="w-1/4"
                    type="number"
                    name="width" 
                    min="0"
                    max="50"
                    value={props.settings.width} 
                    onChange={createSettingsChangeHandler("setWidth")}
                />
            </div>


            <div className="flex justify-between">
                <label htmlFor="birth-factor" className="w-1/2 mr-2">Birth factor:</label>
                <input 
                    className="w-1/4"
                    type="number" 
                    name="birth-factor"
                    step="0.05"
                    min="0"
                    max="1"
                    value={props.settings.birthFactor}
                    onChange={createSettingsChangeHandler("setBirthFactor")}
                />
            </div>

            <div className="flex justify-between">
                <label htmlFor="birth-factor" className="w-1/2 mr-2">Tick duration (ms):</label>
                <input 
                    className="w-1/4"
                    type="number" 
                    name="tick-duration"
                    step="100"
                    min="100"
                    max="10000"
                    value={props.settings.tickDuration}
                    onChange={createSettingsChangeHandler("setTickDuration")}
                />
            </div>


        </div>
    )
}

export default GameSettingsView;