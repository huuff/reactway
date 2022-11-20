import classNames from "classnames";
import { PlaybackGameSettingsAction, PlaybackMode } from "../game/settings";

type PlayBarProps = {
    tickDuration: number | null,
    setPlayback: (mode: PlaybackMode) => void,
} & { className?: string }

// TODO: Test
const PlayBar = ({tickDuration, setPlayback, className }: PlayBarProps) => {
    return (
        <div className={className || ""}>
            { tickDuration !== null ? "Playing" : "Paused" }
            <span onClick={() => setPlayback("play")}> &gt; </span>
            <span onClick={() => setPlayback("pause")}> || </span>
        </div>
    )
}

export default PlayBar;