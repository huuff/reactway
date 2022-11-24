import { faPlay, faPause, faRepeat, faEraser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Playback } from '../game/use-playback';
import ClassedSlot from "./ClassedSlot";

type PlayBarProps = {
    playback: Playback,
    historyLength: number,
    historyPosition: number,
    setHistoryPosition: (newPosition: number) => void,
    startNewGame: () => void,
    clearGrid: () => void,
} & { className?: string }

// TODO: A settings context?
const PlayBar = ({
    playback: { isPlaying, start, pause },
    historyLength,
    historyPosition,
    setHistoryPosition,
    startNewGame,
    clearGrid,
    className
}: PlayBarProps) => {
    return (
        <div className={`${className || ""} h-8 flex items-center`}>
            <ClassedSlot className="mr-3 h-4 text-blue-500 cursor-pointer hover:scale-125">
                { isPlaying
                    ? <FontAwesomeIcon icon={faPause} title="pause" onClick={pause} />
                    : <FontAwesomeIcon icon={faPlay} title="play" onClick={start} />
                }
            </ClassedSlot>
            <input
                type="range"
                min="0"
                value={historyPosition}
                max={historyLength - 1}
                onChange={(e) => setHistoryPosition(+e.currentTarget.value)}
                className="grow" />

            <div className="mr-1 whitespace-nowrap">
                <FontAwesomeIcon
                    icon={faEraser}
                    title="clear"
                    className="inline-block ml-2 h-4 hover:scale-125 text-red-500 cursor-pointer"
                    onClick={clearGrid} />
                <FontAwesomeIcon
                    icon={faRepeat}
                    title="reset"
                    className="inline-block ml-2 h-4 hover:scale-125 text-green-500 cursor-pointer"
                    onClick={startNewGame} />
            </div>
        </div>
    )
}

export default PlayBar;
export type { PlayBarProps };