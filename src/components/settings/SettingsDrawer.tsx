import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useToggle } from "usehooks-ts";
import { CSSTransition } from "react-transition-group";
import PlayBar from "./PlayBar";
import { Playback } from "../../settings/use-playback";
import { useMemo } from "react";
import { getTheme } from "../../util/get-theme";
import GameSettingsView from "./GameSettingsView";
import ClientSideOnly from "../util/ClientSideOnly";
import { useDarkMode } from "../../hooks/use-dark-mode";

type SettingsDrawerProps = {
    readonly playback: Playback;
    readonly historyPosition: number;
    readonly historyLength: number;
    readonly setHistoryPosition: (newPosition: number) => void;
    readonly startNewGame: () => void;
    readonly clear: () => void;
};

const SettingsDrawer = ({
    playback,
    historyLength,
    historyPosition,
    setHistoryPosition,
    startNewGame,
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
                `}
                    data-testid="drawer"
                >
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
                        <GameSettingsView />
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
                {/* This would always throw a warning on me and I was getting desperate, so I just client-sided it */ }
                {/* Note that there are other icons where this is solved by just putting data-fa-title-id */ }
                {/* But not this one */ }
                <ClientSideOnly>
                    <FontAwesomeIcon
                        icon={drawerIcon}
                        className="w-6 h-3 mx-auto"
                        data-fa-title-id="toggle-drawer-icon"
                        title="toggle-drawer" />
                </ClientSideOnly>
            </button>
        </>
    );
};

export default SettingsDrawer;