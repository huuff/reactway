import { useRouter } from "next/router";
import { useMemo } from "react";
import { GridType } from "../grid/grid";
import { StringObject, toStringObject } from "../util/to-string-object";
import { useLocalStorage } from "usehooks-ts";
import { ParsedUrlQuery } from "querystring";
import { useEvent } from "react-use-event-hook"; // XXX: Maybe use the real thing once it's released

type GameSettings = {
    readonly height: number;
    readonly width: number;
    readonly birthFactor: number;
    readonly tickDuration: number;
    readonly cellSize: number;
    readonly view: GridViewType;
    readonly type: GridType;
}

// Game Settings as query parameters are the same as game settings, but any
// missing param is taken to be the default
type GameSettingsQueryParams = StringObject<GameSettings>

type GridViewType = "table" | "ascii" | "canvas";

type GameSettingsAction = {
    type: "setHeight" | "setWidth" | "setBirthFactor" | "setTickDuration";
    value: number,
} | {
    type: "setView";
    value: GridViewType;
} | {
    type: "setType";
    value: GridType;
} | {
    type: "changeCellSize";
    value: "increment" | "decrement";
} | {
    type: "reset";
}

type GameSettingsNumberAction = (GameSettingsAction & { value: number })["type"]
type NumberGameSetting = keyof {
    [k in keyof GameSettings as GameSettings[k] extends number ? k : never]: any
};

// Default settings, not stored in localStorage
const globalDefaultSettings: GameSettings = {
    height: 50,
    width: 50,
    birthFactor: 0.2,
    tickDuration: 1000,
    cellSize: 3,
    view: "canvas",
    type: "array",
};

// XXX: Too many type assertions! I don't think there's a way around it
// (https://stackoverflow.com/a/68898908/15768984)
// Other than overloads, which aren't much better
function getQueryParamSettingOrDefault<S extends keyof GameSettings>(
    settingName: S,
    query: ParsedUrlQuery,
    defaultSettings: GameSettings,
): GameSettings[S] {
    switch (settingName) {
        case "view":
            const queryView = query[settingName];
            if (queryView === "table" || queryView === "ascii" || queryView === "canvas")
                return queryView as GameSettings[S];
            else
                return defaultSettings["view"] as GameSettings[S];
        case "type":
            const queryType = query[settingName];
            if (queryType === "array" || queryType === "map" || queryType === "tuple")
                return queryType as GameSettings[S];
            else
                return defaultSettings["type"] as GameSettings[S];
        default:
            return +(query[settingName] ?? defaultSettings[settingName].toString()) as GameSettings[S];
    }
}

type SettingsLimits = { [setting in NumberGameSetting]: number};

const MINIMUMS: SettingsLimits = {
    height: 5,
    width: 5,
    birthFactor: 0,
    tickDuration: 100,
    cellSize: 1,
}

const MAXIMUMS: SettingsLimits = {
    height: 500,
    width: 500,
    birthFactor: 1,
    tickDuration: 10000,
    cellSize: 10,
}

// Returns the value if it fits the bounds, or the bound (minimum or maximum) otherwise
function coerceWithinBounds(setting: keyof SettingsLimits, value: number): number {
    if (value < MINIMUMS[setting]) {
        return MINIMUMS[setting];
    } else if (value > MAXIMUMS[setting]) {
        return MAXIMUMS[setting];
    } else {
        return value;
    }
}


function useSettings(
    defaultSettings: GameSettings = globalDefaultSettings,
): [GameSettings, (action: GameSettingsAction) => void] {
    const router = useRouter();
    const [storedSettings, setStoredSettings] = useLocalStorage("settings", defaultSettings);

    const settings: GameSettings = useMemo(() => ({
        height: getQueryParamSettingOrDefault("height", router.query, storedSettings),
        width: getQueryParamSettingOrDefault("width", router.query, storedSettings),
        birthFactor: getQueryParamSettingOrDefault("birthFactor", router.query, storedSettings),
        tickDuration: getQueryParamSettingOrDefault("tickDuration", router.query, storedSettings),
        view: getQueryParamSettingOrDefault("view", router.query, storedSettings),
        type: getQueryParamSettingOrDefault("type", router.query, storedSettings),
        cellSize: getQueryParamSettingOrDefault("cellSize", router.query, storedSettings),
    }), [router.query, storedSettings]);

    const dispatchSettings = useEvent((action: GameSettingsAction) => {
        let nextQueryParams: { [key: string]: string };

        switch (action.type) {
            case "setHeight": {
                const nextValue = coerceWithinBounds("height", action.value);
                nextQueryParams = { ...router.query, height: nextValue.toString() };
                setStoredSettings({ ...settings, ...storedSettings, height: nextValue });
                break;
            }
            case "setWidth": {
                const nextValue = coerceWithinBounds("width", action.value);
                nextQueryParams = { ...router.query, width: nextValue.toString() };
                setStoredSettings({ ...settings, ...storedSettings, width: nextValue });
                break;
            }
            case "setBirthFactor": {
                const nextValue = coerceWithinBounds("birthFactor", action.value);
                nextQueryParams = { ...router.query, birthFactor: nextValue.toString() };
                setStoredSettings({ ...settings, ...storedSettings, birthFactor: nextValue });
                break;
            }
            case "setTickDuration": {
                const nextValue = coerceWithinBounds("tickDuration", action.value);
                nextQueryParams = { ...router.query, tickDuration: nextValue.toString() };
                setStoredSettings({ ...storedSettings, ...settings, tickDuration: nextValue });
                break;
            }
            case "setView": {
                nextQueryParams = { ...router.query, view: action.value };
                setStoredSettings({ ...settings, ...storedSettings, view: action.value });
                break;
            }
            case "setType": {
                nextQueryParams = { ...router.query, type: action.value };
                setStoredSettings({ ...settings, ...storedSettings, type: action.value });
                break;
            }
            case "changeCellSize": {
                switch (action.value) {
                    case "increment": {
                        const nextValue = coerceWithinBounds("cellSize", settings.cellSize + 1);
                        nextQueryParams = { ...router.query, cellSize: nextValue.toString()};
                        setStoredSettings({ ...settings, ...storedSettings, cellSize: nextValue})
                        break;
                    }
                    case "decrement": {
                        const nextValue = coerceWithinBounds("cellSize", settings.cellSize - 1);
                        nextQueryParams = { ...router.query, cellSize: nextValue.toString()};
                        setStoredSettings({ ...settings, ...storedSettings, cellSize: nextValue})
                        break;
                    }
                }
                break;
            }
            case "reset": {
                nextQueryParams = toStringObject(defaultSettings);
                setStoredSettings(defaultSettings);
                break;
            }
        }
        router.push({ pathname: "/game", query: nextQueryParams });
    });

    return [settings, dispatchSettings];
}


export type {
    GameSettings,
    GameSettingsQueryParams,
    GridViewType,
    GameSettingsAction,
    GameSettingsNumberAction,
    NumberGameSetting,
};
export { useSettings, globalDefaultSettings as defaultSettings, }