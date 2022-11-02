import { useReducer, useState, useEffect } from "react";
import GameGrid from "./GameGrid";
import GameSettingsView from "./GameSettingsView";
import { settingsReducer, defaultSettings } from "../game/settings";
import { ArrayGrid  } from "../game/array-grid";
import { defaultConwayStrategy } from "../game/conway-strategy";
import { Link, useParams } from "react-router-dom";
import { seedRoute, SeedRoutePathParams } from "../routes/active-routes";
import { randomSeed } from "../game/birth-function";


// TODO: Should maybe be in a context
let tickTimer: ReturnType<typeof setInterval>
const Game = () => {
    // https://stackoverflow.com/a/70000958/15768984
    const { seed } = useParams<keyof SeedRoutePathParams>() as SeedRoutePathParams
    const [ settings, dispatchSettings ] = useReducer(settingsReducer, defaultSettings)
    const [ grid, setGrid ] = useState(ArrayGrid.create(settings, seed))

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
        setGrid(ArrayGrid.create({height, width, birthFactor}, seed))
    }, [ height, width, birthFactor, seed ])

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
            <div className="mt-10 text-center">
                <Link to={seedRoute.build({ seed: randomSeed()}, {})}>
                    <button type="button" className="rounded-full bg-sky-500 p-2 text-slate-100">Restart</button>
                </Link>
            </div>
        </div>
    )
} 

export default Game;