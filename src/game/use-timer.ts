import React from "react";
import { ConwayStrategy } from "./conway-strategy";
import { Grid } from "./grid";

function useTimer<T extends Grid<T>>(
    conwayStrategy: ConwayStrategy, 
    setGrid: React.Dispatch<React.SetStateAction<T>>)
    : [(duration: number) => void, () => void ] {
    let tickTimer: ReturnType<typeof setInterval>

    const stopTimer = () => {
        if (tickTimer) {
            clearInterval(tickTimer);
        }
    };

    const startTimer = (tickDuration: number) => {
        stopTimer();
        tickTimer = setInterval(() => {
            setGrid((it) => it.tick(conwayStrategy))
        }, tickDuration)
    };

    return [startTimer, stopTimer];
}

export { useTimer };