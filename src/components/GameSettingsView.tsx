import { ChangeEvent, useCallback } from "react";
import { GameSettings, AnyGameSettingsAction, GameSettingsActionType } from "../game/settings";

type GameSettingsViewProps = {
    settings: GameSettings,
    dispatchSettings: React.Dispatch<AnyGameSettingsAction>
} & { className: string }

const GameSettingsView = ({ settings, dispatchSettings, className }: GameSettingsViewProps) => {
    const createNumberSettingsChangeHandler = useCallback(
        (eventType: Exclude<GameSettingsActionType, "setView" | "setType">) => {
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

        if (value === "ascii" || value === "table") {
            dispatchSettings({
                type: "setView",
                value,
            })
        }
    }, [dispatchSettings]);

    const handleTypeSettingsChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        if (value === "array" || value === "map") {
            dispatchSettings({
                type: "setType",
                value,
            })
        }
    }, [dispatchSettings]);

    return (
        <div className={className}>
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
                </select>
            </div>

            <div className="flex justify-between">
                <label htmlFor="height" className="w-1/2 mr-2">Height:</label>
                <input
                    className="w-1/4"
                    type="number"
                    name="height"
                    min="0"
                    max="50"
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
                    min="0"
                    max="50"
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
                    value={settings.tickDuration}
                    onChange={createNumberSettingsChangeHandler("setTickDuration")}
                />
            </div>


        </div>
    )
}

export default GameSettingsView;