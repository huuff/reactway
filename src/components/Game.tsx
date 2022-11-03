import { useState, useEffect } from "react";
import GameGrid from "./GameGrid";
import GameSettingsView from "./GameSettingsView";
import { useSettings, defaultSettings } from "../game/settings";
import { ArrayGrid  } from "../game/array-grid";
import { defaultConwayStrategy } from "../game/conway-strategy";
import { Link, useParams } from "react-router-dom";
import { seedRoute, SeedRoutePathParams } from "../routes/active-routes";
import { randomSeed } from "../game/birth-function";
import { useTimer } from "../game/use-timer";


const Game = () => {
    // https://stackoverflow.com/a/70000958/15768984
    const { seed } = useParams<keyof SeedRoutePathParams>() as SeedRoutePathParams

    const [ settings, dispatchSettings ] = useSettings(defaultSettings)
    // TODO: useGrid that has a tickGrid function
    const [ grid, setGrid ] = useState(ArrayGrid.create(settings, seed))

    const { height, width, birthFactor, tickDuration } = settings
    const [ startTimer, stopTimer ] = useTimer(defaultConwayStrategy, setGrid);


    useEffect(() => {
        setGrid(ArrayGrid.create({height, width, birthFactor}, seed))
    }, [ height, width, birthFactor, seed ]);

    useEffect(() => {
        startTimer(tickDuration);
    }, [ tickDuration ]);

    
    useEffect(() => {
        return () => {
            stopTimer();
        }
    }, []);
    

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
                <Link to={seedRoute.build({ seed: randomSeed()}, settings)}>
                    <button type="button" className="rounded-full bg-sky-500 p-2 text-slate-100">
                        Restart
                    </button>
                </Link>
            </div>
        </div>
    )
} 

export default Game;