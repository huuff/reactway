import "tailwindcss/tailwind.css";
import { useEffect, useReducer } from "react";
import AsciiGameGrid from "../src/components/grid/AsciiGameGrid";
import TableGameGrid from "../src/components/grid/TableGameGrid";
import GameSettingsView from "../src/components/GameSettingsView";
import { defaultSettings, PlaybackMode, useSettings } from "../src/game/settings";
import { useInterval } from "usehooks-ts";
import { useRouter } from "next/router";
import { randomSeed } from "../src/util/birth-function";
import { NextPage } from "next";
import { toStringObject } from "../src/util/to-string-object";
import { getGridFactory } from "../src/grid/grid-factory";
import NoSsr from "../src/components/NoSSR";
import PlayBar from "../src/components/PlayBar";
import CanvasGameGrid from "../src/components/grid/CanvasGameGrid";
import { historyReducer, newDefaultTickHistory } from "../src/grid/tick-history";

type GameProps = {
    readonly seed: string;
}

const Game: NextPage<GameProps> = ({ seed }: GameProps) => {
    useEffect(() => {
        import("dragscroll");
    }, []);

    const router = useRouter();

    const [settings, dispatchSettings] = useSettings(defaultSettings);
    const { height, width, birthFactor, tickDuration, view, type } = settings
    const [ tickHistory, dispatchTickHistory ] = useReducer(
        historyReducer, newDefaultTickHistory(getGridFactory(type)({ ...settings, seed }))
    );

    const { current: grid, position: historyPosition, length: historyLength } = tickHistory;

    useEffect(() => {
        dispatchTickHistory({
            type: "reset",
            value: getGridFactory(type)({ height, width, birthFactor, seed })
        })
    }, [height, width, birthFactor, seed, type, dispatchTickHistory]);

    useInterval(() => {
        dispatchTickHistory({ type: "tick" });
    }, tickDuration);

    const dispatchPlayback = (mode: PlaybackMode) => dispatchSettings({
        type: "setPlayback",
        value: mode,
    })

    return (
        <div>
            <div className="max-h-screen overflow-scroll dragscroll cursor-move">
                <NoSsr>
                    { (view === "table") && <TableGameGrid className="mx-auto" grid={grid} /> }
                    { (view === "ascii") && <AsciiGameGrid className="text-center" grid={grid} /> }
                    { (view === "canvas") && <CanvasGameGrid className="mx-auto" grid={grid} /> }
                </NoSsr>
            </div>

            <div className="
                absolute
                bottom-0 
                inset-x-0 
                mx-auto 
                w-fit
                v-1/4
                mb-5
                ">
                <PlayBar
                    className="border rounded-lg drop-shadow-lg bg-white p-2 mb-2 opacity-90"
                    tickDuration={tickDuration} 
                    historyPosition={historyPosition}
                    historyLength={historyLength}
                    dispatchTickHistory={dispatchTickHistory}
                    setPlayback={dispatchPlayback}
                />
                <GameSettingsView
                    className="border rounded-lg drop-shadow-lg bg-white p-2 opacity-90"
                    settings={settings}
                    dispatchSettings={dispatchSettings}
                />
                <div className="mt-2 text-center">
                    <button
                        type="button"
                        className="rounded-full bg-sky-500 p-2 text-slate-100"
                        onClick={() => router.push({
                            pathname: "game", query: {
                                seed: randomSeed(), ...(toStringObject(settings))
                            }
                        })}
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