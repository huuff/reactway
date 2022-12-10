import { useEffect, useMemo, WheelEvent } from "react";
import GameSettingsView from "../src/components/settings/GameSettingsView";
import { defaultSettings, useSettings } from "../src/settings/settings";
import { useDarkMode, useElementSize, useInterval, useToggle, useWindowSize } from "usehooks-ts";
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
import SlowIndicator from "../src/components/SlowIndicator";
import { CSSTransition } from "react-transition-group";
import "animate.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

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

    const [gridRef, isGridBiggerThanViewport] = useIsGridBiggerThanViewport();

    const [settingsVisible, toggleSettingsVisibility] = useToggle();

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
            <SlowIndicator resetSettings={() => dispatchSettings({ type: "reset" })} />
            <CSSTransition in={settingsVisible} classNames={{
                enterActive: 'animate__slideInUp',
                exitActive: 'animate__slideOutDown',
                exitDone: "translate-y-48",
            }} timeout={500}>
                <div className={`
                animate__animated
                fixed
                bottom-0 
                inset-x-0 
                mx-auto 
                w-96
                mb-2
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
                        settings={settings}
                        dispatchSettings={dispatchSettings}
                        isVisible={settingsVisible}
                        toggleVisible={toggleSettingsVisibility}
                    />
                </div>
            </CSSTransition>
            <button className={classNames(
                "fixed",
                "bottom-0",
                "inset-x-0",
                "z-30",
                "border",
                "rounded-sm",
                "drop-shadow-lg",
                `bg-${theme.windowBackground.className}`,
                "opacity-90",
                "px-2",
                "w-1/12",
                "mx-auto",
                //{ ["-mt-2"]: settingsVisible },
                //{ ["-mb-2"]: !settingsVisible },
                `w-1/4 hover:bg-${theme.button.hover.className}`,
                "cursor-pointer",
                "block",
            )}
                onClick={toggleSettingsVisibility}>
                {settingsVisible && <FontAwesomeIcon icon={faChevronDown} className="w-6 h-3 mx-auto" />}
                {!settingsVisible && <FontAwesomeIcon icon={faChevronUp} className="w-6 h-3 mx-auto" />}
            </button>
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