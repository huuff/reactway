import { useContext, useEffect, useMemo, WheelEvent } from "react";
import { defaultSettings, useSettings } from "../src/settings/settings";
import { useElementSize, useInterval, useWindowSize } from "usehooks-ts";
import { useRouter } from "next/router";
import { randomSeed } from "../src/util/birth-function";
import { GetServerSideProps, NextPage } from "next";
import { toStringObject } from "../src/util/to-string-object";
import { getGridFactory } from "../src/grid/grid-factory";
import ClientSideOnly from "../src/components/util/ClientSideOnly";
import { useGrid } from "../src/game/use-grid";
import { usePlayback } from "../src/settings/use-playback";
import GameGridView from "../src/components/grid/GameGridView";
import { useThrottledCallback } from "beautiful-react-hooks";
import ScrollContainer from "react-indiana-drag-scroll";
import { getTheme } from "../src/util/get-theme";
import classNames from "classnames";
import "animate.css";
import SettingsDrawer from "../src/components/settings/SettingsDrawer";
import { PerformanceTrackerContext } from "../src/hooks/use-performance-tracker";
import PopulationCounter from "../src/components/settings/PopulationCounter";
import { useDarkMode } from "../src/hooks/use-dark-mode";

type GameProps = {
    readonly seed: string;
}

const Game: NextPage<GameProps> = ({ seed }: GameProps) => {
    const { isDarkMode } = useDarkMode();
    const theme = useMemo(() => getTheme(isDarkMode), [isDarkMode]);

    const [settings, dispatchSettings] = useSettings(defaultSettings);
    const { height, width, birthFactor, tickDuration, view, type, cellSize } = settings;
    const playback = usePlayback();

    const wheelHandler = useThrottledCallback((e: WheelEvent<HTMLDivElement>) => {
        if (e.deltaY < 0) {
            dispatchSettings({ type: "changeCellSize", value: "decrement" });
        } else {
            dispatchSettings({ type: "changeCellSize", value: "increment" });
        }
    }, [dispatchSettings], 20);

    // XXX: We only want this to run on first render, otherwise, this is too expensive to run on
    // every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const initialGrid = useMemo(() => getGridFactory(type)({ ...settings, seed }), []);

    const {
        grid,
        historyPosition,
        historyLength,

        setHistoryPosition,
        restart,
        tick,
        clear,
        toggleCell,
    } = useGrid(initialGrid);

    useEffect(() => {
        restart(getGridFactory(type)({ height, width, birthFactor, seed }));
    }, [height, width, birthFactor, seed, type, restart]);

    // XXX. Remember not to remove this even if unused. I periodically use it to log to console
    // average overhead
    const performanceTracker = useContext(PerformanceTrackerContext);
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
        });
    };

    const [gridRef, isGridBiggerThanViewport] = useIsGridBiggerThanViewport();


    return (
        <div onWheel={wheelHandler} className={`bg-${theme.windowBackground.className}`}>
            <ScrollContainer
                className={classNames(
                    "h-screen",
                    { "cursor-move": isGridBiggerThanViewport },
                )}
            >
                <ClientSideOnly>
                    <GameGridView grid={grid}
                        view={view}
                        cellSize={cellSize}
                        toggleCell={toggleCell}
                        innerRef={gridRef}
                    />
                </ClientSideOnly>
            </ScrollContainer>

            <SettingsDrawer
                historyPosition={historyPosition}
                setHistoryPosition={setHistoryPosition}
                historyLength={historyLength}
                clear={clear}
                playback={playback}
                startNewGame={startNewGame}
            />
            <ClientSideOnly>
                <PopulationCounter population={grid.population} />
            </ClientSideOnly>
        </div>
    );
};

function useIsGridBiggerThanViewport(): [((node: HTMLDivElement | null) => void), boolean] {
    const { width: windowWidth, height: windowHeight } = useWindowSize();
    const [ref, { width: gridWidth, height: gridHeight }] = useElementSize<HTMLDivElement>();

    return [
        ref,
        gridWidth > windowWidth || gridHeight > windowHeight,
    ];
}

export const getServerSideProps: GetServerSideProps =  async ({ query }) => {
    if (typeof query.seed === "string") {
        return { props: { seed: query.seed } };
    } else {
        return { props: { seed: "fixed seed" } };
    }
};

export default Game;