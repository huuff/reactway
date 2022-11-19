import { NextServer } from "next/dist/server/next";
import { NextRouter, useRouter } from "next/router";
import { useMemo } from "react";
import { toStringObject, StringObject } from "../util/to-string-object";

type GameSettings = {
    readonly height: number;
    readonly width: number;
    readonly birthFactor: number;
    readonly tickDuration: number;
    readonly view: "table" | "ascii";
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
    view: "table",
}

// XXX: Too many type assertions! I don't think there's a way around it
// (https://stackoverflow.com/a/68898908/15768984)
// Other than overloads, which aren't much better
function getQueryParamSettingOrDefault<S extends keyof GameSettings>(
    settingName: S,
    router: NextRouter,
): GameSettings[S] {
    if (settingName === "view") {
        const queryView = router.query[settingName];
        if (queryView === "table" || queryView === "ascii")
            return queryView as GameSettings[S];
        else
            return defaultSettings["view"] as GameSettings[S];
    } else {
        return +(router.query[settingName] ?? defaultSettings[settingName].toString()) as GameSettings[S];
    }
}


function useSettings(): [GameSettings, (action: GameSettingsAction) => void] {
    const router = useRouter();

    const settings: GameSettings = useMemo(() => ({
        height: getQueryParamSettingOrDefault("height", router),
        width: getQueryParamSettingOrDefault("width", router),
        birthFactor: getQueryParamSettingOrDefault("birthFactor", router),
        tickDuration: getQueryParamSettingOrDefault("tickDuration", router),
        view: getQueryParamSettingOrDefault("view", router),
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