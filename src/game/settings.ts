import { useRouter } from "next/router";
import { useMemo } from "react";
import { GridType } from "../grid/grid";
import { StringObject } from "../util/to-string-object";
import { useLocalStorage } from "usehooks-ts";
import { ParsedUrlQuery } from "querystring";
import { NoNullValues } from "../util/no-null-values";

type GameSettings = {
    readonly height: number;
    readonly width: number;
    readonly birthFactor: number;
    readonly tickDuration: number | null;
    readonly view: GridViewType,
    readonly type: GridType,
}

// Game Settings as query parameters are the same as game settings, but any
// missing param is taken to be the default
type GameSettingsQueryParams = StringObject<GameSettings>

type PlaybackMode = "play" | "pause";
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
    type: "setPlayback";
    value: PlaybackMode;
};
type GameSettingsNumberAction = "setHeight" | "setWidth" | "setBirthFactor" | "setTickDuration";

// Default settings, not stored in localStorage
const globalDefaultSettings: NoNullValues<GameSettings> = Object.freeze({
    height: 10,
    width: 10,
    birthFactor: 0.2,
    tickDuration: 1000,
    view: "canvas",
    type: "array",
});

// XXX: Too many type assertions! I don't think there's a way around it
// (https://stackoverflow.com/a/68898908/15768984)
// Other than overloads, which aren't much better
function getQueryParamSettingOrDefault<S extends keyof GameSettings>(
    settingName: S,
    query: ParsedUrlQuery,
    defaultSettings: NoNullValues<GameSettings>,
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
            if (queryType === "array" || queryType === "map")
                return queryType as GameSettings[S];
            else
                return defaultSettings["type"] as GameSettings[S];
        case "tickDuration":
            const queryTickDuration = query["tickDuration"];
            if (queryTickDuration === "null")
                return null as GameSettings[S];
        default:
            return +(query[settingName] ?? defaultSettings[settingName].toString()) as GameSettings[S];
    }
}

const minimums = {
    height: 5,
    width: 5,
    birthFactor: 0,
    tickDuration: 100,
}

// Returns the given value if it's over the minimum, or the minimum otherwise
function coerceAtLeastMinimum(setting: keyof typeof minimums, value: number): number {
    return value < minimums[setting] ? minimums[setting] : value;
}

function useSettings(
    defaultSettings: NoNullValues<GameSettings>
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
    }), [router.query, storedSettings]);

    const dispatchSettings = (action: GameSettingsAction) => {
        let nextQueryParams: { [key: string]: string };

        switch (action.type) {
            case "setHeight": {
                const nextValue = coerceAtLeastMinimum("height", action.value);
                nextQueryParams = { ...router.query, height: nextValue.toString() };
                setStoredSettings({ ...settings, ...storedSettings, height: nextValue });
                break;
            }
            case "setWidth": {
                const nextValue = coerceAtLeastMinimum("width", action.value);
                nextQueryParams = { ...router.query, width: nextValue.toString() };
                setStoredSettings({ ...settings, ...storedSettings, width: nextValue });
                break;
            }
            case "setBirthFactor": {
                const nextValue = coerceAtLeastMinimum("birthFactor", action.value);
                nextQueryParams = { ...router.query, birthFactor: nextValue.toString() };
                setStoredSettings({ ...settings, ...storedSettings, birthFactor: nextValue });
                break;
            }
            case "setTickDuration": {
                const nextValue = coerceAtLeastMinimum("tickDuration", action.value);
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
            case "setPlayback": {
                switch (action.value) {
                    case "play":
                        nextQueryParams = {
                            ...router.query,
                            tickDuration: storedSettings.tickDuration.toString()
                        };
                        break;
                    case "pause":
                        nextQueryParams = { ...router.query, tickDuration: "null" };
                        break;
                }
                break;
            }
        }
        router.push({ pathname: "/game", query: nextQueryParams });
    }

    return [settings, dispatchSettings];
}


export type {
    GameSettings,
    GameSettingsQueryParams,
    PlaybackMode,
    GridViewType,
    GameSettingsAction,
    GameSettingsNumberAction,
};
export { useSettings, globalDefaultSettings as defaultSettings, }