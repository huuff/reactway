import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useDarkMode, useToggle } from "usehooks-ts";
import { CSSTransition } from "react-transition-group";
import PlayBar from "./PlayBar";
import { Playback } from "../../settings/use-playback";
import { useMemo } from "react";
import { getTheme } from "../../util/get-theme";
import { GameSettings, GameSettingsAction } from "../../settings/settings";
import GameSettingsView from "./GameSettingsView";
import ClientSideOnly from "../util/ClientSideOnly";

type SettingsDrawerProps = {
    readonly playback: Playback;
    readonly historyPosition: number;
    readonly historyLength: number;
    readonly setHistoryPosition: (newPosition: number) => void;
    readonly startNewGame: () => void;
    readonly settings: GameSettings;
    readonly dispatchSettings: (action: GameSettingsAction) => void;
    readonly clear: () => void;
};

// TODO: Maybe test showing and hiding? Maybe with shallow rendering?
const SettingsDrawer = ({
    playback,
    historyLength,
    historyPosition,
    setHistoryPosition,
    startNewGame,
    settings,
    dispatchSettings,
    clear,
}: SettingsDrawerProps) => {
    const [isVisible, toggleVisible] = useToggle(true);
    const { isDarkMode } = useDarkMode();
    const theme = useMemo(() => getTheme(isDarkMode), [isDarkMode]);

    const drawerIcon = isVisible ? faChevronDown : faChevronUp;

    return (
        <>
            <CSSTransition in={isVisible} classNames={{
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
                    <ClientSideOnly>
                        <GameSettingsView
                            settings={settings}
                            dispatchSettings={dispatchSettings}
                        />
                    </ClientSideOnly>
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
                `w-1/4 hover:bg-${theme.button.hover.className}`,
                "cursor-pointer",
                "block",
            )}
                onClick={toggleVisible}>
                <FontAwesomeIcon icon={drawerIcon} className="w-6 h-3 mx-auto" />
            </button>
        </>
    );
};

export default SettingsDrawer;