import { NextRouter, useRouter } from "next/router";
import { useMemo } from "react";
import { toStringObject, StringObject } from "../util/to-string-object";

type GameSettings = {
    readonly height: number;
    readonly width: number;
    readonly birthFactor: number;
    readonly tickDuration: number;
}

// Game Settings as query parameters are the same as game settings, but any
// missing param is taken to be the default
type GameSettingsQueryParams = StringObject<GameSettings>

type GameSettingsActionType = "setHeight" | "setWidth" | "setBirthFactor" | "setTickDuration";
type GameSettingsAction = {
    readonly type: GameSettingsActionType;
    readonly value: number;
}

const defaultSettings: GameSettings = {
    height: 10,
    width: 10,
    birthFactor: 0.2,
    tickDuration: 1000,
}

function getQueryParamSettingOrDefault(
    settingName: keyof GameSettings,
    router: NextRouter
): number {
    return +(router.query[settingName] ?? defaultSettings[settingName].toString())
}


function useSettings(
    defaultSettings: GameSettings,
): [GameSettings, (action: GameSettingsAction) => void] {
    const router = useRouter();

    const settings: GameSettings = useMemo(() => ({
        height: getQueryParamSettingOrDefault("height", router),
        width: getQueryParamSettingOrDefault("width", router),
        birthFactor: getQueryParamSettingOrDefault("birthFactor", router),
        tickDuration: getQueryParamSettingOrDefault("tickDuration", router),
    }), [router.query]);

    const dispatchSettings = (action: GameSettingsAction) => {
        let nextQueryParams: { [key: string]: string };
        switch (action.type) {
            case "setHeight":
                nextQueryParams = { ...router.query, height: action.value.toString() };
                break;
            case "setWidth":
                nextQueryParams = { ...router.query, width: action.value.toString() };
                break;
            case "setBirthFactor":
                nextQueryParams = { ...router.query, birthFactor: action.value.toString() };
                break;
            case "setTickDuration":
                nextQueryParams = { ...router.query, tickDuration: action.value.toString() };
                break;
        }
        router.push({ pathname: "/game", query: nextQueryParams });
    }

    return [settings, dispatchSettings];
}


export type { GameSettings, GameSettingsQueryParams, GameSettingsAction, GameSettingsActionType, }
export { useSettings, defaultSettings }