import { useCallback, useEffect, useState } from "react";
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


// TODO: From query params
function useSettings(defaultSettings: GameSettings): [GameSettings, (action: GameSettingsAction) => void] {
    const [ settings, setSettings ] = useState<GameSettings>(defaultSettings)

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


export type { GameSettings, GameSettingsQueryParams, GameSettingsAction, GameSettingsActionType, }
export { useSettings, defaultSettings }