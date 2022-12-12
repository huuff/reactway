import useInterval from "beautiful-react-hooks/useInterval";
import sum from "lodash/sum";
import { createContext, useCallback, useMemo, useState } from "react";
import { trimArray } from "../util/trim-array";
import { SetOptional } from "type-fest";

type SampleRecord = {
    event?: string;
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
    expectedSavedMs: 50,
    description: "Visual effect on hovered cells",
};

const visibleAreaFeature: Feature = {
    name: "visible",
    expectedSavedMs: 25,
    description: "Rendered area might have been reduced",
};

const allFeatures = [visibleAreaFeature, hoverFeature];

type PerformanceTracker = {
    isSlow: boolean;
    averageOverhead: number;
    recordSample: (record: SetOptional<SampleRecord, "timeOfRecord">) => void;
    disabledFeatures: Feature[];
    isDisabled: (feature: Feature["name"]) => boolean;
    updateBatches: () => void;
    reset: () => void;
}

/**
 * All time-tracked elements will be grouped into batches of this size to calculate
 * an average time spent doing calculations, renders, etc.
 */
const BATCH_SLICE_DURATION = 1000;

/**
 * When the average load starts to exceed this much, performance is considered to be degraded.
 */
const MAX_EXPECTED_AVERAGE_OVERHEAD = 150;

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
    const [records, setRecords] = useState<SampleRecord[]>([]);
    const [recordBatches, setRecordBatches] = useState<number[][]>([]);

    const recordSample = useCallback<PerformanceTracker["recordSample"]>((record) => {
        setRecords((previousRecords) => {
            const fullRecord: SampleRecord = {
                timeSpentMs: record.timeSpentMs,
                event: record.event,
                timeOfRecord: record.timeOfRecord ?? new Date(),
            };

            return trimArray([...previousRecords, fullRecord], 20).array;
        });
    }, [setRecords]);

    const updateBatches = useCallback(() => {
        if (records.length === 0) {
            return;
        }

        const tickTimeBatches: number[][] = [];

        let currentBatch: number[] = [];
        let currentBatchStartTime = records[0].timeOfRecord.getTime();
        for (const record of records) {
            if (record.timeOfRecord.getTime() > currentBatchStartTime + BATCH_SLICE_DURATION) {
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
    }, [setRecordBatches, records]);

    if (updateBatchesInInterval) {
        // XXX: updateBatchesInInterval should NEVER change at runtime (it's akin to a compile-time constant)
        // it should only be false for testing
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useInterval(() => {
            updateBatches();
        }, BATCH_SLICE_DURATION);
    }

    const averageOverhead = useMemo(() => {
        if (recordBatches.length === 0) {
            return 0;
        }

        return sum(recordBatches.map(
            (batchRecords) => sum(batchRecords))
        ) / recordBatches.length;
    }, [recordBatches]);

    const disabledFeatures = useMemo(() => {
        let expectedOverhead = averageOverhead;
        let result: Feature[] = [];

        for (const feature of allFeatures) {
            if (expectedOverhead > MAX_EXPECTED_AVERAGE_OVERHEAD + feature.expectedSavedMs * 2) {
                expectedOverhead - feature.expectedSavedMs;
                result.push(feature);
            }
        }

        return result;
    }, [averageOverhead]);

    const isDisabled = useCallback((feature: Feature["name"]) => {
        return disabledFeatures.some((f) => f.name === feature);
    }, [disabledFeatures]);

    const isSlow = useMemo(() => averageOverhead > MAX_EXPECTED_AVERAGE_OVERHEAD, [averageOverhead]);

    const reset = useCallback(() => setRecords([]), [setRecords]);

    return {
        isSlow,
        averageOverhead,
        disabledFeatures,
        isDisabled,
        updateBatches,
        recordSample,
        reset
    };
}

// A fake performance tracker as a default
const PerformanceTrackerContext = createContext<PerformanceTracker>({
    isSlow: false,
    averageOverhead: 0,
    recordSample: (x) => { },
    disabledFeatures: [],
    isDisabled: (f) => false,
    updateBatches: () => { },
    reset: () => { },
});

export { usePerformanceTracker, PerformanceTrackerContext };
export type { PerformanceTracker };