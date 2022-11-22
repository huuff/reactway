import { PlaybackMode } from "../game/settings";
import { faPlay, faPause, faRepeat } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HistoryAction } from "../grid/tick-history";
import { ChangeEvent, Dispatch } from "react";
import { randomSeed } from "../util/birth-function";
import { useRouter } from "next/router";
import ClassedSlot from "./ClassedSlot";

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
            <ClassedSlot className="mr-3 h-4 text-blue-500 cursor-pointer hover:scale-125">
                {tickDuration !== null
                    ? <FontAwesomeIcon icon={faPause} onClick={() => setPlayback("pause")} />
                    : <FontAwesomeIcon icon={faPlay}  onClick={() => setPlayback("play")} />
                }
            </ClassedSlot>
            <input
                type="range"
                min="0"
                value={historyPosition}
                max={historyLength - 1}
                onChange={handleChange}
                className="grow" />

            <div className="ml-3">
                <FontAwesomeIcon className="h-4 hover:scale-125 text-green-500 cursor-pointer" icon={faRepeat} onClick={newGame} />
            </div>
        </div>
    )
}

export default PlayBar;