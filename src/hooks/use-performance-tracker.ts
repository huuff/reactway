import useInterval from "beautiful-react-hooks/useInterval";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { trimArray } from "../util/trim-array";
import { SetOptional } from "type-fest";
import sumBy from "lodash/sumBy";
import sum from "lodash/sum";

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

const NUMBER_OF_RECORDS_TO_KEEP = 70;

/**
 * All time-tracked elements will be grouped into batches of this size to calculate
 * an average time spent doing calculations, renders, etc.
 */
const BATCH_SLICE_DURATION = 1000;

/**
 * Number of batches that will be taken before measuring the average overhead.
 * This means that the calculation will be done every BATCH_SLICE_DURATION * BATCHES_FOR_OVERHEAD_CALCULATION 
 */
const BATCHES_FOR_OVERHEAD_CALCULATION = 10;

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
    const [recordBatches, setRecordBatches] = useState<SampleRecord[][]>([]);

    const recordSample = useCallback<PerformanceTracker["recordSample"]>((record) => {
        setRecords((previousRecords) => {
            const fullRecord: SampleRecord = {
                timeSpentMs: record.timeSpentMs,
                event: record.event,
                timeOfRecord: record.timeOfRecord ?? new Date(),
            };

            return trimArray([...previousRecords, fullRecord], NUMBER_OF_RECORDS_TO_KEEP).array;
        });
    }, [setRecords]);

    const updateBatches = useCallback(() => {
        if (records.length === 0) {
            return;
        }

        const sampleBatches: SampleRecord[][] = [];

        let currentBatch: SampleRecord[] = [];
        let currentBatchStartTime = records[0].timeOfRecord.getTime();
        for (const record of records) {
            if (record.timeOfRecord.getTime() > currentBatchStartTime + BATCH_SLICE_DURATION) {
                sampleBatches.push(currentBatch);
                currentBatch = [record];
                currentBatchStartTime = record.timeOfRecord.getTime();
            } else {
                currentBatch.push(record);
            }
        }
        if (currentBatch.length !== 0) {
            sampleBatches.push(currentBatch);
        }

        setRecordBatches(sampleBatches);
    }, [setRecordBatches, records]);

    if (updateBatchesInInterval) {
        // XXX: updateBatchesInInterval should NEVER change at runtime (it's akin to a compile-time constant)
        // it should only be false for testing
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useInterval(() => {
            updateBatches();
        }, BATCH_SLICE_DURATION * BATCHES_FOR_OVERHEAD_CALCULATION);
    }

    const averageOverhead = useMemo(() => {
        if (recordBatches.length === 0) {
            return 0;
        }

        return sum(recordBatches.map(
            (batchRecords) => sumBy(batchRecords, (r) => r.timeSpentMs))
        ) / recordBatches.length;
    }, [recordBatches]);

    const [ disabledFeatures, setDisabledFeatures ] = useState<Feature[]>([]);

    useEffect(() => {
        setDisabledFeatures((currentDisabledFeatures) => {
            const nextFeaturesToDisable: Feature[] = [];

            let amortizedMaxOverhead = MAX_EXPECTED_AVERAGE_OVERHEAD;
            for (const feature of allFeatures) {
                // If this feature is enabled
                if (currentDisabledFeatures.some((it) => it.name === feature.name)) {
                    // Then the maximum expected overhead must be lower, due to the savings the
                    // feature must be causing
                    amortizedMaxOverhead -= feature.expectedSavedMs;
    
                    // If the overhead is still higher than that, then we keep the feature disabled
                    if (averageOverhead > amortizedMaxOverhead) {
                        nextFeaturesToDisable.push(feature);
                    }
                } else if (averageOverhead > (amortizedMaxOverhead + feature.expectedSavedMs)) {
                    // If the overhead is high enough to warrant sufficient savings, we enable it
                    amortizedMaxOverhead -= feature.expectedSavedMs;
                    nextFeaturesToDisable.push(feature);
                }
            }

            return nextFeaturesToDisable;
        });
    }, [averageOverhead, setDisabledFeatures]);

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