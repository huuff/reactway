import { useContext, useEffect, useMemo, WheelEvent } from "react";
import GameSettingsView from "../src/components/settings/GameSettingsView";
import { defaultSettings, useSettings } from "../src/settings/settings";
import { useDarkMode, useElementSize, useInterval, useWindowSize } from "usehooks-ts";
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
import DarkModeSelector from "../src/components/settings/DarkModeSelector";
import { getTheme } from "../src/util/get-theme";
import classNames from "classnames";
import { PerformanceTrackerContext } from "../src/hooks/use-performance-tracker";
import SlowIndicator from "../src/components/SlowIndicator";

type GameProps = {
    readonly seed: string;
}

const Game: NextPage<GameProps> = ({ seed }: GameProps) => {
    const { isDarkMode } = useDarkMode();
    const theme = useMemo(() => getTheme(isDarkMode), [isDarkMode]);

    const [settings, dispatchSettings] = useSettings(defaultSettings);
    const { height, width, birthFactor, tickDuration, view, type, cellSize } = settings
    const playback = usePlayback();

    const wheelHandler = useThrottledCallback((e: WheelEvent<HTMLDivElement>) => {
        if (e.deltaY < 0) {
            dispatchSettings({ type: "changeCellSize", value: "decrement" });
        } else {
            dispatchSettings({ type: "changeCellSize", value: "increment" });
        }
    }, [dispatchSettings], 20);

    const performanceTracker = useContext(PerformanceTrackerContext);

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
        console.log(`Average tick duration: ${performanceTracker.averageTickDuration}`);
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

    const [gridRef, isGridBiggerThanViewport] = useIsGridBiggerThanViewport();

    return (
        <div onWheel={wheelHandler} className={`bg-${theme.windowBackground.className}`}>
            <ScrollContainer
                className={classNames(
                    "h-screen",
                    { "cursor-move": isGridBiggerThanViewport },
                )}
            >
                <NoSsr>
                    <GameGridView grid={grid}
                        view={view}
                        cellSize={cellSize}
                        toggleCell={toggleCell}
                        innerRef={gridRef}
                    />
                </NoSsr>
            </ScrollContainer>

            <DarkModeSelector />
            <SlowIndicator resetSettings={() => dispatchSettings({type: "reset"})}/>
            <div className={`
                fixed
                bottom-0 
                inset-x-0 
                mx-auto 
                w-fit
                v-1/4
                mb-5
                z-20
                `}>
                <PlayBar
                    className={`
                    border
                    rounded-lg 
                    drop-shadow-lg
                    bg-${theme.windowBackground.className}
                    p-2 
                    mb-2 
                    opacity-90 
                    `}
                    playback={playback}
                    historyPosition={historyPosition}
                    setHistoryPosition={setHistoryPosition}
                    historyLength={historyLength}
                    startNewGame={startNewGame}
                    clearGrid={clear}
                />
                <GameSettingsView
                    className={`
                    border 
                    rounded-lg 
                    drop-shadow-lg 
                    bg-${theme.windowBackground.className}
                    p-2
                    opacity-90
                    `}
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

function useIsGridBiggerThanViewport(): [((node: HTMLDivElement | null) => void), boolean] {
    const { width: windowWidth, height: windowHeight } = useWindowSize();
    const [ref, { width: gridWidth, height: gridHeight }] = useElementSize<HTMLDivElement>();

    return [
        ref,
        gridWidth > windowWidth || gridHeight > windowHeight,
    ]
}

export default Game;