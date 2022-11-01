import { useReducer } from "react";
import GameGrid from "./GameGrid";
import GameSettingsView from "./GameSettingsView";
import { settingsReducer, defaultSettings } from "../game/settings";


const Game = () => {
    const [ settings, dispatchSettings ] = useReducer(settingsReducer, defaultSettings)

    return (
        <div>
            <GameGrid 
                className="w-1/2 mx-auto text-center"
                settings={settings}
             />
            <GameSettingsView 
                className="w-1/4 mx-auto mt-5" 
                settings={settings}
                dispatchSettings={dispatchSettings}
            />
        </div>
    )
} 

export default Game;