import { ChangeEvent, useCallback } from "react";
import { GameSettings, GameSettingsAction, GameSettingsNumberAction, GridViewType } from "../game/settings";

type GameSettingsViewProps = {
    settings: GameSettings,
    dispatchSettings: React.Dispatch<GameSettingsAction>
} & { className?: string }

// TODO: Try to debounce inputs! (I may have to write my own hook)
// The fact that the input field updates immediately makes it hard to follow a normal
// flow for updating it (e.g., deleting it and setting it), since, for example, deleting
// it means it's set to 0, which will break the game
const GameSettingsView = ({ settings, dispatchSettings, className }: GameSettingsViewProps) => {
    const createNumberSettingsChangeHandler = useCallback(
        (eventType: GameSettingsNumberAction) => {
            return (e: ChangeEvent<HTMLInputElement>) => {
                dispatchSettings({
                    type: eventType,
                    value: +e.target.value,
                })
            }
        }, [dispatchSettings]
    );
    const handleViewSettingsChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
            dispatchSettings({
                type: "setView",
                value: value as GridViewType,
            })
    }, [dispatchSettings]);

    const handleTypeSettingsChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        if (value === "array" || value === "map" || value === "set") {
            dispatchSettings({
                type: "setType",
                value,
            })
        }
    }, [dispatchSettings]);

    return (
        <div className={className || ""}>
            <div className="flex justify-between">
                <label htmlFor="view" className="w-1/2 mr-2">View:</label>
                <select
                    className="w-1/4"
                    name="view"
                    onChange={handleViewSettingsChange}
                    value={settings.view}
                >
                    <option value="ascii">ascii</option>
                    <option value="table">table</option>
                    <option value="canvas">canvas</option>
                </select>
            </div>

            <div className="flex justify-between">
                <label htmlFor="type" className="w-1/2 mr-2">Type:</label>
                <select
                    className="w-1/4"
                    name="type"
                    onChange={handleTypeSettingsChange}
                    value={settings.type}
                >
                    <option value="array">array</option>
                    <option value="map">map</option>
                    <option value="set">set</option>
                </select>
            </div>

            <div className="flex justify-between">
                <label htmlFor="height" className="w-1/2 mr-2">Height:</label>
                <input
                    className="w-1/4"
                    type="number"
                    name="height"
                    min="5"
                    max="100"
                    value={settings.height}
                    onChange={createNumberSettingsChangeHandler("setHeight")}
                />
            </div>

            <div className="flex justify-between">
                <label htmlFor="width" className="w-1/2 mr-2">Width:</label>
                <input
                    className="w-1/4"
                    type="number"
                    name="width"
                    min="5"
                    max="100"
                    value={settings.width}
                    onChange={createNumberSettingsChangeHandler("setWidth")}
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
                    value={settings.birthFactor}
                    onChange={createNumberSettingsChangeHandler("setBirthFactor")}
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
                    disabled={settings.tickDuration === null}
                    value={settings.tickDuration || "paused"}
                    onChange={createNumberSettingsChangeHandler("setTickDuration")}
                />
            </div>


        </div>
    )
}

export default GameSettingsView;