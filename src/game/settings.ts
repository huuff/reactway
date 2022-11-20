import { useRouter } from "next/router";
import { useMemo } from "react";
import { GridType } from "../grid/grid-factory";
import { StringObject } from "../util/to-string-object";
import { useLocalStorage } from "usehooks-ts";
import { ParsedUrlQuery } from "querystring";
import { NoNullValues } from "../util/no-null-values";

type GameSettings = {
    readonly height: number;
    readonly width: number;
    readonly birthFactor: number;
    readonly tickDuration: number | null;
    readonly view: "table" | "ascii";
    readonly type: GridType,
}

// Game Settings as query parameters are the same as game settings, but any
// missing param is taken to be the default
type GameSettingsQueryParams = StringObject<GameSettings>

type GameSettingsActionType =
    "setHeight"
    | "setWidth"
    | "setBirthFactor"
    | "setTickDuration"
    | "setView"
    | "setType"
    | "setPlayback"
    ;

type PlaybackMode = "play" | "pause";
type GameSettingsAction<V> = {
    readonly type: GameSettingsActionType;
    readonly value: V;
}

type NumberGameSettingsActionType = Exclude<GameSettingsActionType, "setView" | "setType" | "setPlayback">;
type NumberGameSettingsAction
    = GameSettingsAction<GameSettings[Exclude<keyof GameSettings, "view" | "type" | "tickDuration">]> & {
        type: NumberGameSettingsActionType;
    };
type ViewGameSettingsAction = GameSettingsAction<GameSettings["view"]> & {
    type: "setView";
};

type TypeGameSettingsAction = GameSettingsAction<GameSettings["type"]> & {
    type: "setType";
}

type PlaybackGameSettingsAction = GameSettingsAction<PlaybackMode> & {
    type: "setPlayback";
}

type AnyGameSettingsAction = NumberGameSettingsAction
    | ViewGameSettingsAction
    | TypeGameSettingsAction
    | PlaybackGameSettingsAction
    ;

// Default settings, not stored in localStorage
const globalDefaultSettings: NoNullValues<GameSettings> = {
    height: 10,
    width: 10,
    birthFactor: 0.2,
    tickDuration: 1000,
    view: "table",
    type: "array",
}

// XXX: Too many type assertions! I don't think there's a way around it
// (https://stackoverflow.com/a/68898908/15768984)
// Other than overloads, which aren't much better
// TODO: I should clean this up, at least with a switch
function getQueryParamSettingOrDefault<S extends keyof GameSettings>(
    settingName: S,
    query: ParsedUrlQuery,
    defaultSettings: NoNullValues<GameSettings>,
): GameSettings[S] {
    if (settingName === "view") {
        const queryView = query[settingName];
        if (queryView === "table" || queryView === "ascii")
            return queryView as GameSettings[S];
        else
            return defaultSettings["view"] as GameSettings[S];
    } else if (settingName === "type") {
        const queryType = query[settingName];
        if (queryType === "array" || queryType === "map")
            return queryType as GameSettings[S];
        else
            return defaultSettings["type"] as GameSettings[S];
    } else if (settingName === "tickDuration") {
        const queryTickDuration = query["tickDuration"];
        if (queryTickDuration === "null")
            return null as GameSettings[S];
        else {
            return +(query[settingName] ?? defaultSettings[settingName].toString()) as GameSettings[S];
        }
    } else {
        return +(query[settingName] ?? defaultSettings[settingName].toString()) as GameSettings[S];
    }
}


function useSettings(
    defaultSettings: NoNullValues<GameSettings>
): [GameSettings, (action: AnyGameSettingsAction) => void] {
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

    const dispatchSettings = (action: AnyGameSettingsAction) => {
        let nextQueryParams: { [key: string]: string };
        

        switch (action.type) {
            case "setHeight":
                nextQueryParams = { ...router.query, height: action.value.toString() };
                setStoredSettings({ ...settings, ...storedSettings, height: action.value });
                break;
            case "setWidth":
                nextQueryParams = { ...router.query, width: action.value.toString() };
                setStoredSettings({ ...settings, ...storedSettings, width: action.value });
                break;
            case "setBirthFactor":
                nextQueryParams = { ...router.query, birthFactor: action.value.toString() };
                setStoredSettings({ ...settings, ...storedSettings, birthFactor: action.value });
                break;
            case "setTickDuration":
                nextQueryParams = { ...router.query, tickDuration: action.value.toString() };
                setStoredSettings({ ...storedSettings, ...settings, tickDuration: action.value });
                break;
            case "setView":
                nextQueryParams = { ...router.query, view: action.value };
                setStoredSettings({ ...settings, ...storedSettings,  view: action.value });
                break;
            case "setType":
                nextQueryParams = { ...router.query, type: action.value };
                setStoredSettings({ ...settings, ...storedSettings,  type: action.value });
                break;
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
    AnyGameSettingsAction,
    GameSettingsActionType,
    NumberGameSettingsActionType,
    PlaybackGameSettingsAction,
    PlaybackMode,
};
export { useSettings, globalDefaultSettings as defaultSettings, }