import "tailwindcss/tailwind.css";
import { useEffect } from "react";
import AsciiGameGrid from "../src/components/AsciiGameGrid";
import TableGameGrid from "../src/components/TableGameGrid";
import GameSettingsView from "../src/components/GameSettingsView";
import { useSettings } from "../src/game/settings";
import { ArrayGrid } from "../src/grid/array-grid";
import { defaultConwayStrategy } from "../src/game/conway-strategy";
import { useInterval } from "usehooks-ts";
import { useGrid } from "../src/grid/use-grid";
import { useRouter } from "next/router";
import { randomSeed } from "../src/game/birth-function";
import { NextPage } from "next";
import { toStringObject } from "../src/util/to-string-object";

type GameProps = {
    readonly seed: string;
}

const Game: NextPage<GameProps> = ({ seed }: GameProps) => {
    const router = useRouter();

    const [settings, dispatchSettings] = useSettings();
    const { grid, tick, setGrid } = useGrid(ArrayGrid.create(settings, seed), defaultConwayStrategy);

    const { height, width, birthFactor, tickDuration, view } = settings

    
    useEffect(() => {
        setGrid(ArrayGrid.create({ height, width, birthFactor }, seed))
    }, [height, width, birthFactor, seed]);
    

    useInterval(() => {
        tick();
    }, tickDuration);

    return (
        <div>
            {
                view === "table"
                    ? <TableGameGrid className="w-1/2 mx-auto text-center" grid={grid} />
                    : <AsciiGameGrid className="w-1/2 mx-auto text-center" grid={grid} />
            }

            <GameSettingsView
                className="w-1/3 mx-auto mt-5"
                settings={settings}
                dispatchSettings={dispatchSettings}
            />
            <div className="mt-10 text-center">
                <button
                     type="button" 
                     className="rounded-full bg-sky-500 p-2 text-slate-100"
                     onClick={() => router.push({ pathname: "game", query: { 
                        seed: randomSeed(), ...(toStringObject(settings))
                     } })}
                     >
                    Restart
                </button>
            </div>
        </div>
    )
}

Game.getInitialProps = async ({ query }) => {
    return {
        seed: query.seed as string, // TODO: No type assertion please
    }
}

export default Game;