import { useState } from "react";
import GameGrid from "./GameGrid";
import GameSettingsView from "./GameSettingsView";

// TODO: Should maybe be somewhere else
type GameSettings = {
    readonly height: number;
    readonly width: number;
    readonly birthFactor: number;
}

// TODO: A reducer for settings?
const defaultSettings: GameSettings = {
    height: 10,
    width: 10,
    birthFactor: 0.2,
}

const Game = () => {
    const [ settings, setSettings ] = useState<GameSettings>(defaultSettings)

    return (
        <div>
            <GameGrid className="w-1/2 mx-auto text-center" {...settings} />
            <GameSettingsView className="w-1/2 mx-auto text-left" {...settings} />
        </div>
    )
} 

export type { GameSettings };
export default Game;