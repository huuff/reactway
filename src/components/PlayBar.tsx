import { PlaybackMode } from "../game/settings";
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { HistoryAction } from "../grid/tick-history";
import { ChangeEvent, Dispatch } from "react";

type PlayBarProps = {
    tickDuration: number | null,
    setPlayback: (mode: PlaybackMode) => void,
    historyLength: number,
    historyPosition: number,
    dispatchTickHistory: Dispatch<HistoryAction>, // TODO: Only one option to dispatch a setPosition?
} & { className?: string }

// TODO: Test
const PlayBar = ({
    tickDuration,
    setPlayback,
    historyLength,
    historyPosition,
    dispatchTickHistory,
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
            {tickDuration !== null
                ? <FontAwesomeIcon icon={faPause} width="16" onClick={() => setPlayback("pause")} />
                : <FontAwesomeIcon icon={faPlay} width="16" onClick={() => setPlayback("play")} />
            }
            <input 
                type="range" 
                min="0"
                value={historyPosition}
                max={historyLength - 1}
                onChange={handleChange}
                className="ml-5 grow" />
        </div>
    )
}

export default PlayBar;