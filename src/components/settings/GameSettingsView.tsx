import { ChangeEvent, useCallback, useEffect } from "react";
import { useDebounce } from "usehooks-ts";
import { GridType } from "../../grid/grid";
import { GameSettings, GameSettingsAction, GridViewType } from "../../settings/settings";
import { useNumberInput } from "../../util/use-number-input";

type GameSettingsViewProps = {
    settings: GameSettings,
    dispatchSettings: React.Dispatch<GameSettingsAction>
} & { className?: string }

const DEBOUNCE_DELAY = 500;

const GameSettingsView = ({ settings, dispatchSettings, className }: GameSettingsViewProps) => {
    const heightInput = useNumberInput(settings.height);
    const debouncedHeight = useDebounce(heightInput.value, DEBOUNCE_DELAY);

    // TODO: Only dispatch if they meet the minimums and maximums
    // TODO: DRY this
    useEffect(() => {
        debouncedHeight && dispatchSettings({type: "setHeight", value: debouncedHeight});
    }, [debouncedHeight]);

    const widthInput = useNumberInput(settings.width);
    const debouncedWidth = useDebounce(widthInput.value, DEBOUNCE_DELAY);

    useEffect(() => {
        debouncedWidth && dispatchSettings({type: "setWidth", value: debouncedWidth});
    }, [debouncedWidth]);

    const birthFactorInput = useNumberInput(settings.birthFactor);
    const debouncedBirthFactor = useDebounce(birthFactorInput.value, DEBOUNCE_DELAY);

    useEffect(() => {
        debouncedBirthFactor && dispatchSettings({type: "setBirthFactor", value: debouncedBirthFactor});
    }, [debouncedBirthFactor]);

    const tickDurationInput = useNumberInput(settings.tickDuration);
    const debouncedTickDuration = useDebounce(tickDurationInput.value, DEBOUNCE_DELAY);

    useEffect(() => {
        debouncedTickDuration && dispatchSettings({type: "setTickDuration", value: debouncedTickDuration})
    }, [debouncedTickDuration]);


    const handleViewSettingsChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
            dispatchSettings({type: "setView", value: e.target.value as GridViewType});
    }, [dispatchSettings]);

    const handleTypeSettingsChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
            dispatchSettings({type: "setType", value: e.target.value as GridType});
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
                    {...heightInput}
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
                    {...widthInput}
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
                    {...birthFactorInput}
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
                    {...tickDurationInput}
                />
            </div>


        </div>
    )
}

export default GameSettingsView;