import { NextRouter, useRouter } from "next/router";
import { useMemo } from "react";
import { GridType } from "../grid/grid-factory";
import { StringObject } from "../util/to-string-object";
import { useLocalStorage } from "usehooks-ts";

type GameSettings = {
    readonly height: number;
    readonly width: number;
    readonly birthFactor: number;
    readonly tickDuration: number;
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
    ;
type GameSettingsAction<V> = {
    readonly type: GameSettingsActionType;
    readonly value: V;
}

type NumberGameSettingsActionType = Exclude<GameSettingsActionType, "setView" | "setType">;
type NumberGameSettingsAction
    = GameSettingsAction<GameSettings[Exclude<keyof GameSettings, "view" | "type">]> & {
        type: NumberGameSettingsActionType;
    };
type ViewGameSettingsAction = GameSettingsAction<GameSettings["view"]> & {
    type: "setView";
};

type TypeGameSettingsAction = GameSettingsAction<GameSettings["type"]> & {
    type: "setType";
}

type AnyGameSettingsAction = NumberGameSettingsAction | ViewGameSettingsAction | TypeGameSettingsAction;

// Default settings, not stored in localStorage
const defaultSettings: GameSettings = {
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
function getQueryParamSettingOrDefault<S extends keyof GameSettings>(
    settingName: S,
    router: NextRouter,
    defaultSettings: GameSettings,
): GameSettings[S] {
    if (settingName === "view") {
        const queryView = router.query[settingName];
        if (queryView === "table" || queryView === "ascii")
            return queryView as GameSettings[S];
        else
            return defaultSettings["view"] as GameSettings[S];
    } else if (settingName === "type") {
        const queryType = router.query[settingName];
        if (queryType === "array" || queryType === "map")
            return queryType as GameSettings[S];
        else
            return defaultSettings["type"] as GameSettings[S];
    } else {
        return +(router.query[settingName] ?? defaultSettings[settingName].toString()) as GameSettings[S];
    }
}


function useSettings(): [GameSettings, (action: AnyGameSettingsAction) => void] {
    const router = useRouter();
    const [ storedSettings, setStoredSettings ] = useLocalStorage("settings", defaultSettings);

    const settings: GameSettings = useMemo(() => ({
        height: getQueryParamSettingOrDefault("height", router, storedSettings),
        width: getQueryParamSettingOrDefault("width", router, storedSettings),
        birthFactor: getQueryParamSettingOrDefault("birthFactor", router, storedSettings),
        tickDuration: getQueryParamSettingOrDefault("tickDuration", router, storedSettings),
        view: getQueryParamSettingOrDefault("view", router, storedSettings),
        type: getQueryParamSettingOrDefault("type", router, storedSettings),
    }), [router.query]);

    const dispatchSettings = (action: AnyGameSettingsAction) => {
        let nextQueryParams: { [key: string]: string };
        switch (action.type) {
            case "setHeight":
                nextQueryParams = { ...router.query, height: action.value.toString() };
                setStoredSettings({ ...settings, height: action.value });
                break;
            case "setWidth":
                nextQueryParams = { ...router.query, width: action.value.toString() };
                setStoredSettings({ ...settings, width: action.value });
                break;
            case "setBirthFactor":
                nextQueryParams = { ...router.query, birthFactor: action.value.toString() };
                setStoredSettings({ ...settings, birthFactor: action.value });
                break;
            case "setTickDuration":
                nextQueryParams = { ...router.query, tickDuration: action.value.toString() };
                setStoredSettings({ ...settings, tickDuration: action.value });
                break;
            case "setView":
                nextQueryParams = { ...router.query, view: action.value };
                setStoredSettings({ ...settings, view: action.value } );
                break;
            case "setType":
                nextQueryParams = { ...router.query, type: action.value };
                setStoredSettings({ ...settings, type: action.value } );
                break;
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
    NumberGameSettingsActionType
};
export { useSettings, defaultSettings as defaultSettings }