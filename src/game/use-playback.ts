import { useState } from "react";

type PlaybackMode = "play" | "pause";

type Playback = {
    isPlaying: boolean;

    start: () => void;
    pause: () => void;
}

// TODO: Test (A nice chance to start using the react testing hooks library")
// TODO: Maybe even put the ticking here?
function usePlayback(initialState: PlaybackMode = "play"): Playback {
    const [playbackMode, setPlaybackMode] = useState<PlaybackMode>(initialState);

    return {
        isPlaying: playbackMode === "play",
        start: () => setPlaybackMode("play"),
        pause: () => setPlaybackMode("pause"),
    }
}

export type { PlaybackMode, Playback };
export { usePlayback };