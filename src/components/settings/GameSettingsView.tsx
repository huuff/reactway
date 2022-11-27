
import { ChangeEvent, useCallback, useEffect } from "react";
import { useDebounce } from "usehooks-ts";
import { GridType } from "../../grid/grid";
import { GameSettings, GameSettingsAction, GridViewType, NumberGameSetting } from "../../settings/settings";
import { typedCapitalize } from "../../util/typed-capitalize";
import { useNumberInput } from "../../util/use-number-input";

type GameSettingsViewProps = {
    settings: GameSettings,
    dispatchSettings: React.Dispatch<GameSettingsAction>
} & { className?: string }

const DEBOUNCE_DELAY = 500;

// TODO: Only dispatch if they meet the minimums and maximums
function useNumberSetting<T extends NumberGameSetting>(
    setting: T,
    settings: GameSettings,
    dispatch: React.Dispatch<GameSettingsAction>,
): ReturnType<typeof useNumberInput> {
    const input = useNumberInput(settings[setting]);
    const debouncedValue = useDebounce(input.value, DEBOUNCE_DELAY);

    useEffect(() => {
        debouncedValue
            && dispatch({ type: `set${typedCapitalize(setting)}`, value: debouncedValue } );
    }, [debouncedValue]); // TODO: dependency on dispatch too?

    return input;
}

const GameSettingsView = ({ settings, dispatchSettings, className }: GameSettingsViewProps) => {
    const heightInput = useNumberSetting("height", settings, dispatchSettings);
    const widthInput = useNumberSetting("width", settings, dispatchSettings);
    const birthFactorInput = useNumberSetting("birthFactor", settings, dispatchSettings);
    const tickDurationInput = useNumberSetting("tickDuration", settings, dispatchSettings);

    const handleViewSettingsChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        dispatchSettings({ type: "setView", value: e.target.value as GridViewType });
    }, [dispatchSettings]);

    const handleTypeSettingsChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        dispatchSettings({ type: "setType", value: e.target.value as GridType });
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