import "tailwindcss/tailwind.css";
import { useEffect } from "react";
import GameSettingsView from "../src/components/settings/GameSettingsView";
import { defaultSettings, useSettings } from "../src/settings/settings";
import { useInterval } from "usehooks-ts";
import { useRouter } from "next/router";
import { randomSeed } from "../src/util/birth-function";
import { NextPage } from "next";
import { toStringObject } from "../src/util/to-string-object";
import { getGridFactory } from "../src/grid/grid-factory";
import NoSsr from "../src/components/util/NoSSR";
import PlayBar from "../src/components/settings/PlayBar";
import { useGrid } from "../src/game/use-grid";
import { usePlayback } from "../src/settings/use-playback";
import GameGridView from "../src/components/grid/GameGridView";
import ScrollContainer from "react-indiana-drag-scroll";

type GameProps = {
    readonly seed: string;
}

const Game: NextPage<GameProps> = ({ seed }: GameProps) => {
    const [settings, dispatchSettings] = useSettings(defaultSettings);
    const { height, width, birthFactor, tickDuration, view, type } = settings
    const playback = usePlayback();

    const { 
        grid,
        historyPosition, 
        historyLength,

        setHistoryPosition,
        restart,
        tick,
        clear,
        toggleCell,
    } = useGrid(getGridFactory(type)({ ...settings, seed }));

    useEffect(() => {
        restart(getGridFactory(type)({ height, width, birthFactor, seed }));
    }, [height, width, birthFactor, seed, type, restart]);

    // TODO: Adjusting the interval: Measure how long the previous tick took and remove that
    // from the time it takes for the next tick (likely with setTimeout or useTimeout)
    useInterval(() => {
        if (playback.isPlaying) {
            tick();
        }
    }, tickDuration);

    const router = useRouter();
    const startNewGame = () => {
        router.push({
            pathname: "game", query: {
                seed: randomSeed(), 
                ...(toStringObject(settings))
            }
        })
    }

    return (
        <div>
            <ScrollContainer className="max-h-screen overflow-scroll cursor-move">
                <NoSsr>
                    <GameGridView toggleCell={toggleCell} grid={grid} view={view}/>
                </NoSsr>
            </ScrollContainer>

            <div className="
                absolute
                bottom-0 
                inset-x-0 
                mx-auto 
                w-fit
                v-1/4
                mb-5
                z-20
                ">
                <PlayBar
                    className="border rounded-lg drop-shadow-lg bg-white p-2 mb-2 opacity-90"
                    playback={playback}
                    historyPosition={historyPosition}
                    setHistoryPosition={setHistoryPosition}
                    historyLength={historyLength}
                    startNewGame={startNewGame}
                    clearGrid={clear}
                />
                <GameSettingsView
                    className="border rounded-lg drop-shadow-lg bg-white p-2 opacity-90"
                    settings={settings}
                    dispatchSettings={dispatchSettings}
                />
            </div>
        </div>
    )
}

Game.getInitialProps = async ({ query }) => {
    if (typeof query.seed === "string") {
        return { seed: query.seed };
    } else {
        return { seed: randomSeed() };
    }
}

export default Game;