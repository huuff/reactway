import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toStringObject } from "../util/to-string-object";

type GameSettings = {
    readonly height: number;
    readonly width: number;
    readonly birthFactor: number;
    readonly tickDuration: number;
}

// Game Settings as query parameters are the same as game settings, but any
// missing param is taken to be the default
type GameSettingsQueryParams = Partial<GameSettings>

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


// TODO: This doesn't work when manually changing query params
function useSettings(defaultSettings: GameSettings): [GameSettings, (action: GameSettingsAction) => void] {
    const [ queryParams, setQueryParams ] = useSearchParams();
    const queryParamsSettings = queryParamsToSettings(queryParams)
    const [ settings, setSettings] = useState<GameSettings>({...defaultSettings, ...queryParamsSettings})

    useEffect(() => {
        setQueryParams(toStringObject(settings))
    }, [ settings, setQueryParams ]);

    const dispatchSettings = (action: GameSettingsAction) => {
        setSettings((previousSettings) => {
            switch (action.type) {
                case "setHeight":
                    return { ...previousSettings, height: action.value };
                case "setWidth":
                    return { ...previousSettings, width: action.value };
                case "setBirthFactor":
                    return { ...previousSettings, birthFactor: action.value};
                case "setTickDuration":
                    return { ...previousSettings, tickDuration: action.value};
            }
        })
    }

    return [ settings, dispatchSettings ];
}

function queryParamsToSettings(queryParams: URLSearchParams): GameSettingsQueryParams {
    const queryParamsAsObject = Object.fromEntries(new URLSearchParams(queryParams));

    const areSettings = Object.keys(queryParamsAsObject).every(
        (it) => ["height", "width", "birthFactor", "tickDuration"].includes(it)
    ) && Object.values(queryParamsAsObject).every (
        (it) => /(\d+\.)?\d+/.test(it) // Is a number
    );

    if (!areSettings) {
        throw new Error("Query params not in the expected format");
    }

    return Object.fromEntries(
        Object.entries(queryParamsAsObject)
        .map<[string, number]>(([key, value]) => [key, +value])
    )
}


export type { GameSettings, GameSettingsQueryParams, GameSettingsAction, GameSettingsActionType, }
export { useSettings, defaultSettings }