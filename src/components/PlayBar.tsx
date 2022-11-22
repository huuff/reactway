import { PlaybackMode } from "../game/settings";
import { faPlay, faPause, faRepeat } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HistoryAction } from "../grid/tick-history";
import { ChangeEvent, Dispatch } from "react";
import { randomSeed } from "../util/birth-function";
import { useRouter } from "next/router";

type PlayBarProps = {
    tickDuration: number | null,
    setPlayback: (mode: PlaybackMode) => void,
    historyLength: number,
    historyPosition: number,
    dispatchTickHistory: Dispatch<HistoryAction>, // TODO: Only one option to dispatch a setPosition?
    newGame: () => void,
} & { className?: string }

// TODO: Test
const PlayBar = ({
    tickDuration,
    setPlayback,
    historyLength,
    historyPosition,
    dispatchTickHistory,
    newGame,
    className
}: PlayBarProps) => {
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        dispatchTickHistory({
            type: "setPosition",
            value: +e.currentTarget.value,
        })
    }

    return (
        <div className={`${className || ""} px-4 flex h-8`}>
            <i className="mr-3 text-blue-500 cursor-pointer">
                {tickDuration !== null
                    ? <FontAwesomeIcon icon={faPause} width="12" onClick={() => setPlayback("pause")} />
                    : <FontAwesomeIcon icon={faPlay} width="12" onClick={() => setPlayback("play")} />
                }
            </i>
            <input
                type="range"
                min="0"
                value={historyPosition}
                max={historyLength - 1}
                onChange={handleChange}
                className="grow" />

            <div className="ml-3">
                <i className="text-green-500 cursor-pointer">
                    <FontAwesomeIcon icon={faRepeat} width="16" onClick={newGame} />
                </i>
            </div>
        </div>
    )
}

export default PlayBar;