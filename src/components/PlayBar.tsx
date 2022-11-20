import { PlaybackMode } from "../game/settings";
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type PlayBarProps = {
    tickDuration: number | null,
    setPlayback: (mode: PlaybackMode) => void,
} & { className?: string }

// TODO: Test
const PlayBar = ({ tickDuration, setPlayback, className }: PlayBarProps) => {
    return (
        <div className={`${className || ""} pl-4`}>
            {tickDuration !== null
                ? <FontAwesomeIcon icon={faPause} width="16" onClick={() => setPlayback("pause")} />
                : <FontAwesomeIcon icon={faPlay} width="16" onClick={() => setPlayback("play")} />
            }
        </div>
    )
}

export default PlayBar;