
import { ChangeEvent, useCallback, useEffect, useMemo } from "react";
import { useDarkMode, useDebounce } from "usehooks-ts";
import { GridType } from "../../grid/grid";
import { GameSettings, GameSettingsAction, GridViewType, NumberGameSetting } from "../../settings/settings";
import { typedCapitalize } from "../../util/typesafe-capitalize";
import { useNumberInput } from "../../hooks/use-number-input";
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getTheme } from "../../util/get-theme";

type GameSettingsViewProps = {
    settings: GameSettings;
    dispatchSettings: React.Dispatch<GameSettingsAction>;
}

const DEBOUNCE_DELAY = 500;

function useNumberSetting<T extends Exclude<NumberGameSetting, "cellSize">>(
    setting: T,
    settings: GameSettings,
    dispatch: React.Dispatch<GameSettingsAction>,
): ReturnType<typeof useNumberInput> {
    const { value, onChange, setValue } = useNumberInput(settings[setting]);
    const debouncedValue = useDebounce(value, DEBOUNCE_DELAY);

    useEffect(() => {
        debouncedValue
            && dispatch({ type: `set${typedCapitalize(setting)}`, value: debouncedValue });
    }, [debouncedValue, dispatch, setting]);

    const settingValue = settings[setting];
    useEffect(() => {
        setValue(settings[setting]);
    }, [settingValue, setValue, settings, setting]);

    return { value, onChange, setValue };
}

const GameSettingsView = ({ settings, dispatchSettings }: GameSettingsViewProps) => {
    const { isDarkMode } = useDarkMode();
    const theme = useMemo(() => getTheme(isDarkMode), [isDarkMode]);

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

    const dispatchIncreaseCellSize = useCallback(() => {
        dispatchSettings({ type: "changeCellSize", value: "increment" });
    }, [dispatchSettings]);

    const dispatchDecreaseCellSize = useCallback(() => {
        dispatchSettings({ type: "changeCellSize", value: "decrement" });
    }, [dispatchSettings]);

    return (
        <>
            <div className={`
                    animate__animated
                    border 
                    rounded-lg 
                    drop-shadow-lg 
                    bg-${theme.windowBackground.className}
                    text-${theme.text.className}
                    p-2
                    opacity-90
                `} >
                <div className="flex justify-between">
                    <label htmlFor="view" className="w-1/2 mr-2">View:</label>
                    <select
                        className={`w-1/4 bg-${theme.input.className}`}
                        id="view"
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
                        className={`w-1/4 bg-${theme.input.className}`}
                        id="type"
                        name="type"
                        onChange={handleTypeSettingsChange}
                        value={settings.type}
                    >
                        <option value="array">array</option>
                        <option value="set">set</option>
                        <option value="map">map</option>
                    </select>
                </div>

                <div className="flex justify-between">
                    <label htmlFor="height" className="w-1/2 mr-2">Height:</label>
                    <input
                        className={`w-1/4 bg-${theme.input.className}`}
                        type="number"
                        id="height"
                        name="height"
                        min="5"
                        max="500"
                        value={heightInput.value || ""}
                        onChange={heightInput.onChange}
                    />
                </div>

                <div className="flex justify-between">
                    <label htmlFor="width" className="w-1/2 mr-2">Width:</label>
                    <input
                        className={`w-1/4 bg-${theme.input.className}`}
                        type="number"
                        id="width"
                        name="width"
                        min="5"
                        max="500"
                        value={widthInput.value || ""}
                        onChange={widthInput.onChange}
                    />
                </div>

                <div className="flex justify-between">
                    <label htmlFor="birth-factor" className="w-1/2 mr-2">Birth factor:</label>
                    <input
                        className={`w-1/4 bg-${theme.input.className}`}
                        type="number"
                        id="birth-factor"
                        name="birth-factor"
                        step="0.05"
                        min="0"
                        max="1"
                        value={birthFactorInput.value || ""}
                        onChange={birthFactorInput.onChange}
                    />
                </div>

                <div className="flex justify-between">
                    <label htmlFor="tick-duration" className="w-1/2 mr-2">Tick duration (ms):</label>
                    <input
                        className={`w-1/4 bg-${theme.input.className}`}
                        type="number"
                        id="tick-duration"
                        name="tick-duration"
                        step="100"
                        min="100"
                        max="10000"
                        value={tickDurationInput.value || ""}
                        onChange={tickDurationInput.onChange}
                    />
                </div>

                <div className="flex justify-around">
                    <div
                        onClick={dispatchDecreaseCellSize}
                        className={`w-1/4 hover:bg-${theme.button.hover.className} pt-1 rounded-md`}>
                        <FontAwesomeIcon
                            icon={faMinus}
                            className="h-4 mx-auto"
                            title="decrease cell size"
                        />
                    </div>
                    <p className="w-1/2 text-center">Cell size: {settings.cellSize}</p>
                    <div
                        onClick={dispatchIncreaseCellSize}
                        className={`w-1/4 hover:bg-${theme.button.hover.className} pt-1 rounded-md`}>
                        <FontAwesomeIcon
                            icon={faPlus}
                            className="h-4 mx-auto"
                            title="increase cell size"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default GameSettingsView;