import { sum } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { trimArray } from "../util/trim-array";

type TickRecord = {
    timeSpentMs: number;
    timeOfRecord: Date;
}

type Feature = {
    name: "hover";
    expectedSavedMs: number;
    description: string;
}

const hoverFeature: Feature = {
    name: "hover",
    expectedSavedMs: 25,
    description: "Visual effect on hovered cells",
}

type PerformanceTracker = {
    isSlow: boolean;
    averageTickDuration: number;
    recordTick: (timeSpentMs: TickRecord["timeSpentMs"], timeOfRecord: TickRecord["timeOfRecord"]) => void;
    disabledFeatures: Feature[];
    isDisabled: (feature: Feature["name"]) => boolean;
}

/**
 * All ticks within this amount of milliseconds will be grouped into a single one.
 * This is useful to calculate whether the game is going slow when there are many grids, as they all are (supposedly)
 * ticking together, we can just do any calculatons with the sum of all tick times.
 */
const MAX_TICK_DURATION_MS = 90;

/**
 * When ticks' duration start to exceed this parameter, performance degrades and dragging becomes sluggish
 */
const MAX_EXPECTED_TICK_DURATION_MS = 100;

/**
 * Time to wait before updating whether the game is being slow. It's not a fast algorithm and updating it
 * on every tick might be too much (especially when there are many grids or the tick rate is too slow)
 * 
 * TODO: I'm not using this yet! Maybe when I write a custom hook to prevent re-running the isSlow until a specific
 * mount of time passes, I can use this again.
 */
const SLICE_OF_SLOW_CALCULATION = 500;

function getUnixTimestampMs(date: Date): number {
    return Math.floor(date.getTime() / 100);
}

function usePerformanceTracker(): PerformanceTracker {
    const [ records, setRecords ] = useState<TickRecord[]>([]);

    const recordTick = useCallback<PerformanceTracker["recordTick"]>((timeSpentMs, timeOfRecord) => {
        setRecords((previousRecords) => trimArray([...previousRecords, { timeSpentMs, timeOfRecord }], 20).array)
    }, [setRecords])

    // TODO: This seems pretty slow! I should make a custom hook that only calls this function every certain number
    // of milliseconds
    const averageTickDuration = useMemo(() => {
        if (records.length === 0) {
            return 0;
        }

        const tickTimeBatches: number[][] = [];

        let currentBatch: number[] = [];
        let currentBatchStartTime = getUnixTimestampMs(records[0].timeOfRecord);
        for (const record of records) {
            if (getUnixTimestampMs(record.timeOfRecord) > currentBatchStartTime + MAX_TICK_DURATION_MS) {
                tickTimeBatches.push(currentBatch);
                currentBatch = [record.timeSpentMs];
                currentBatchStartTime = getUnixTimestampMs(record.timeOfRecord);
            } else {
                currentBatch.push(record.timeSpentMs);
            }
        }

        return sum(tickTimeBatches.map(
            (batchRecords) => sum(batchRecords))
        ) / tickTimeBatches.length;
    }, [records]);

    const disabledFeatures = useMemo(() => {
        if (averageTickDuration > (MAX_EXPECTED_TICK_DURATION_MS + hoverFeature.expectedSavedMs*2)) {
            return [hoverFeature];
        } else {
            return [];
        }
    }, [averageTickDuration])

    const isDisabled = useCallback((feature: Feature["name"]) => {
        return disabledFeatures.some((f) => f.name === feature);
    }, [disabledFeatures]);

    const isSlow = useMemo(() => averageTickDuration > MAX_EXPECTED_TICK_DURATION_MS, [records]);

    return { isSlow, averageTickDuration, disabledFeatures, isDisabled, recordTick };
}

export { usePerformanceTracker };
export type { PerformanceTracker };