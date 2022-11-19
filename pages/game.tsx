import "tailwindcss/tailwind.css";
import { useEffect, useMemo } from "react";
import GameGrid from "../src/components/GameGrid";
import GameSettingsView from "../src/components/GameSettingsView";
import { useSettings, defaultSettings } from "../src/game/settings";
import { ArrayGrid } from "../src/grid/array-grid";
import { defaultConwayStrategy } from "../src/game/conway-strategy";
import { useInterval } from "usehooks-ts";
import { useGrid } from "../src/grid/use-grid";
import { useRouter } from "next/router";
import { randomSeed } from "../src/game/birth-function";


export default () => {
    const router = useRouter();
    const { seed } = router.query;

    if (!seed || typeof seed != "string") {
        return <h1>You must provide a valid seed!</h1>
    }

    const [settings, dispatchSettings] = useSettings(defaultSettings);
    const { grid, tick, setGrid } = useGrid(ArrayGrid.create(settings, seed), defaultConwayStrategy);

    const { height, width, birthFactor, tickDuration } = settings

    
    useEffect(() => {
        setGrid(ArrayGrid.create({ height, width, birthFactor }, seed))
    }, [height, width, birthFactor, seed]);
    

    useInterval(() => {
        tick();
    }, tickDuration);

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
            { /* TODO: Make this a link to a new game with a new route*/ }
                <button
                     type="button" 
                     className="rounded-full bg-sky-500 p-2 text-slate-100"
                     onClick={() => router.push(`/game?seed=${randomSeed()}`)}
                     >
                    Restart
                </button>
            </div>
        </div>
    )
}