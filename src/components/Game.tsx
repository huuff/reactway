import { useReducer, useState, useEffect } from "react";
import GameGrid from "./GameGrid";
import GameSettingsView from "./GameSettingsView";
import { settingsReducer, defaultSettings } from "../game/settings";
import { ArrayGrid  } from "../game/array-grid";
import { randomSeed } from "../game/birth-function";
import { defaultConwayStrategy } from "../game/conway-strategy";

// TODO: Should maybe be in a context
let tickTimer: ReturnType<typeof setInterval>
const Game = () => {
    const [ settings, dispatchSettings ] = useReducer(settingsReducer, defaultSettings)
    const [ grid, setGrid ] = useState(ArrayGrid.create(settings, randomSeed()))

    const { height, width, birthFactor, tickDuration } = settings

    useEffect(() => {
        tickTimer = setInterval(() => {
            setGrid((it) => it.tick(defaultConwayStrategy))
        }, tickDuration)
    })

    useEffect(() => {
        return () => {
            clearInterval(tickTimer);
        }
    })

    useEffect(() => {
        setGrid(ArrayGrid.create(settings, randomSeed()))
    }, [ height, width, birthFactor ])

    useEffect(() => {
        clearInterval(tickTimer)
        tickTimer = setInterval(() => {
            setGrid((it) => it.tick(defaultConwayStrategy))
        }, tickDuration)
    }, [ tickDuration ])

    return (
        <div>
            <GameGrid 
                className="w-1/2 mx-auto text-center"
                grid={grid}
             />
            <GameSettingsView 
                className="w-1/3 mx-auto mt-5" 
                settings={settings}
                dispatchSettings={dispatchSettings}
            />
        </div>
    )
} 

export default Game;