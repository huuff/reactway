
type GameSettings = {
    readonly height: number;
    readonly width: number;
    readonly birthFactor: number;
}

type GameSettingsActionType = "setHeight" | "setWidth" | "setBirthFactor"; 
type GameSettingsAction = {
    readonly type: GameSettingsActionType;
    readonly value: number;
} 

const defaultSettings: GameSettings = {
    height: 10,
    width: 10,
    birthFactor: 0.2,
}

function settingsReducer(settings: GameSettings, action: GameSettingsAction): GameSettings {
    switch (action.type) {
        case "setHeight":
            return { ...settings, height: action.value };
        case "setWidth":
            return { ...settings, width: action.value };
        case "setBirthFactor":
            return { ...settings, birthFactor: action.value}
    }
}


export type { GameSettings, GameSettingsAction, GameSettingsActionType, }
export { settingsReducer, defaultSettings }