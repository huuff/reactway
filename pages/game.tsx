import "tailwindcss/tailwind.css";
import { useEffect, useRef, useState, WheelEvent } from "react";
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
import { useThrottledCallback } from "beautiful-react-hooks";
import ScrollContainer from "react-indiana-drag-scroll";

type GameProps = {
    readonly seed: string;
}

const Game: NextPage<GameProps> = ({ seed }: GameProps) => {
    const [settings, dispatchSettings] = useSettings(defaultSettings);
    const { height, width, birthFactor, tickDuration, view, type, cellSize } = settings
    const playback = usePlayback();

    const wheelHandler = useThrottledCallback((e: WheelEvent<HTMLDivElement>) => {
        if (e.deltaY < 0) {
            dispatchSettings({ type: "changeCellSize", value: "decrement"});
        } else {
            dispatchSettings({ type: "changeCellSize", value: "increment"});
        }
    }, [dispatchSettings], 20);

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

    const scrollContainerRef = useRef<HTMLElement>();
    const  [scroll, setScroll] = useState({ scrollX: 0, scrollY: 0})
    const onScroll  = () => {
        setScroll({
            scrollX: scrollContainerRef?.current?.scrollLeft ?? 0,
            scrollY: scrollContainerRef?.current?.scrollTop ?? 0,
        })
    }
    return (
        <div onWheel={wheelHandler}>
            <div className="cursor-move">
                <ScrollContainer 
                    ref={scrollContainerRef as any /* I don't know why this is needed */}
                    onScroll={onScroll}
                >
                    <NoSsr>
                        <GameGridView grid={grid}
                                    view={view} 
                                    cellSize={cellSize}
                                    toggleCell={toggleCell}
                                    scrollX={scroll.scrollX}
                                    scrollY={scroll.scrollY}
                                    />
                    </NoSsr>
                </ScrollContainer>
            </div>

            <div className="
                fixed
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
        return { seed: "fixed seed" };
    }
}

export default Game;