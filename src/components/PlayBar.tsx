import { PlaybackGameSettingsAction, PlaybackMode } from "../game/settings";

type PlayBarProps = {
    tickDuration: number | null,
    setPlayback: (mode: PlaybackMode) => void,
} & { className?: string }

const PlayBar = ({tickDuration, setPlayback }: PlayBarProps) => {
    return (
        <>
            <div> { tickDuration !== null ? "Playing" : "Paused" }</div>
            <button onClick={() => setPlayback("play")}> &gt; </button>
            <button onClick={() => setPlayback("pause")}> || </button>
        </>
    )
}

export default PlayBar;