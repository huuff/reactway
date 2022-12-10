import { useInterval } from "beautiful-react-hooks";
import { sum } from "lodash";
import { createContext, useCallback, useMemo, useState } from "react";
import { trimArray } from "../util/trim-array";

type TickRecord = {
    timeSpentMs: number;
    timeOfRecord: Date;
}

type Feature = {
    name: "hover" | "visible";
    expectedSavedMs: number;
    description: string;
}

const hoverFeature: Feature = {
    name: "hover",
    expectedSavedMs: 25,
    description: "Visual effect on hovered cells",
};

const visibleAreaFeature: Feature = {
    name: "visible",
    expectedSavedMs: 10,
    description: "Rendered area might have been reduced",
};

const allFeatures = [visibleAreaFeature, hoverFeature];

type PerformanceTracker = {
    isSlow: boolean;
    averageTickDuration: number;
    recordTick: (timeSpentMs: TickRecord["timeSpentMs"], timeOfRecord: TickRecord["timeOfRecord"]) => void;
    disabledFeatures: Feature[];
    isDisabled: (feature: Feature["name"]) => boolean;
    updateBatches: () => void;
    reset: () => void;
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
const MAX_EXPECTED_TICK_DURATION_MS = 90;

/**
 * Time to wait before updating all ticks into batches. It's not a fast algorithm and updating it
 * on every tick might be too much (especially when there are many grids or the tick rate is too slow)
 * 
 */
const SLICE_OF_BATCHES_CALCULATION = 1000;

/**
 * Creates a performance tracker.
 * @param updateBatchesInInterval wether to set an interval that updates batches of tick-times to calculate the
 *                                performance of the ticking. Please note that this should never be changed or 
 *                                errors will start to get thrown due to changing the number of called hooks.
 *                                In fact, this property only exists to aid with testing without having to mock
 *                                `setInterval`
 * @returns The PerformanceTracker
 */
function usePerformanceTracker(updateBatchesInInterval: boolean = true): PerformanceTracker {
    const [ records, setRecords ] = useState<TickRecord[]>([]);
    const [ recordBatches, setRecordBatches ] = useState<number[][]>([]);

    const recordTick = useCallback<PerformanceTracker["recordTick"]>((timeSpentMs, timeOfRecord) => {
        setRecords((previousRecords) => trimArray([...previousRecords, { timeSpentMs, timeOfRecord }], 20).array)
    }, [setRecords])

    const updateBatches = useCallback(() => {
        if (records.length === 0) {
            return;
        }

        const tickTimeBatches: number[][] = [];

        let currentBatch: number[] = [];
        let currentBatchStartTime = records[0].timeOfRecord.getTime();
        for (const record of records) {
            if (record.timeOfRecord.getTime() > currentBatchStartTime + MAX_TICK_DURATION_MS) {
                tickTimeBatches.push(currentBatch);
                currentBatch = [record.timeSpentMs];
                currentBatchStartTime = record.timeOfRecord.getTime();
            } else {
                currentBatch.push(record.timeSpentMs);
            }
        }
        if (currentBatch.length !== 0) {
            tickTimeBatches.push(currentBatch);
        }

        setRecordBatches(tickTimeBatches);
    }, [setRecordBatches, records])

    if (updateBatchesInInterval) {
        useInterval(() => {
            updateBatches();
        }, SLICE_OF_BATCHES_CALCULATION);
    }

    const averageTickDuration = useMemo(() => {
        if (recordBatches.length === 0) {
            return 0;
        }
        
        return sum(recordBatches.map(
            (batchRecords) => sum(batchRecords))
        ) / recordBatches.length;
    }, [recordBatches]);

    const disabledFeatures = useMemo(() => {
        let expectedTickDuration = averageTickDuration;
        let result: Feature[] = [];

        for (const feature of allFeatures) {
            if (expectedTickDuration > MAX_EXPECTED_TICK_DURATION_MS + feature.expectedSavedMs*2) {
                expectedTickDuration - feature.expectedSavedMs;
                result.push(feature);
            }
        }

        return result;
    }, [averageTickDuration])

    const isDisabled = useCallback((feature: Feature["name"]) => {
        return disabledFeatures.some((f) => f.name === feature);
    }, [disabledFeatures]);

    const isSlow = useMemo(() => averageTickDuration > MAX_EXPECTED_TICK_DURATION_MS, [averageTickDuration]);

    const reset = useCallback(() => setRecords([]), [setRecords]);

    return { isSlow, averageTickDuration, disabledFeatures, isDisabled, updateBatches, recordTick, reset };
}

// A fake performance tracker as a default
const PerformanceTrackerContext = createContext<PerformanceTracker>({
    isSlow: false,
    averageTickDuration: 0,
    recordTick: (x, y) => {},
    disabledFeatures: [],
    isDisabled: (f) => false,
    updateBatches: () => {},
    reset: () => {},
});

export { usePerformanceTracker, PerformanceTrackerContext };
export type { PerformanceTracker };