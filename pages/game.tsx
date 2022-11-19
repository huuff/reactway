import "tailwindcss/tailwind.css";
import { useEffect } from "react";
import AsciiGameGrid from "../src/components/AsciiGameGrid";
import TableGameGrid from "../src/components/TableGameGrid";
import GameSettingsView from "../src/components/GameSettingsView";
import { useSettings } from "../src/game/settings";
import { defaultConwayStrategy } from "../src/game/conway-strategy";
import { useInterval } from "usehooks-ts";
import { useGrid } from "../src/grid/use-grid";
import { useRouter } from "next/router";
import { randomSeed } from "../src/util/birth-function";
import { NextPage } from "next";
import { toStringObject } from "../src/util/to-string-object";
import { getGridFactory } from "../src/grid/grid-factory";
import NoSsr from "../src/components/NoSSR";

type GameProps = {
    readonly seed: string;
}

const Game: NextPage<GameProps> = ({ seed }: GameProps) => {
    const router = useRouter();

    const [settings, dispatchSettings] = useSettings();
    const { height, width, birthFactor, tickDuration, view, type } = settings
    const { grid, tick, setGrid } = useGrid(
        getGridFactory(type)({...settings, seed}), defaultConwayStrategy
    );

    
    useEffect(() => {
        setGrid(getGridFactory(type)({ ...settings, seed }))
    }, [height, width, birthFactor, seed, type]);
    

    useInterval(() => {
        tick();
    }, tickDuration);

    return (
        <div>
            <NoSsr>
                {
                    view === "table"
                        ? <TableGameGrid className="w-1/2 mx-auto text-center" grid={grid} />
                        : <AsciiGameGrid className="w-1/2 mx-auto text-center" grid={grid} />
                }
            </NoSsr>

            <div className="absolute bottom-0 inset-x-0 mx-auto w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                <GameSettingsView
                    className="mx-auto"
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
        </div>
    )
}

Game.getInitialProps = async ({ query }) => {
    if (typeof query.seed === "string") {
        return { seed: query.seed };
    } else {
        return { seed: "asdf" };
    }
}

export default Game;