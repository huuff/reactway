import { render, screen } from "@testing-library/react";
import { PerformanceTracker, PerformanceTrackerContext } from "../../hooks/use-performance-tracker";
import SlowIndicator from "./SlowIndicator";

describe("SlowIndicator", () => {

    test("it doesn't show when there are no performance issues", () => {
        const fakePerformanceTracker: PerformanceTracker = {
            isSlow: false,
            averageOverhead: 0,
            recordSample: jest.fn(),
            disabledFeatures: [],
            isDisabled: jest.fn(),
            updateBatches: jest.fn(),
            reset: jest.fn(),
        };

        render(
            <PerformanceTrackerContext.Provider value={fakePerformanceTracker}>
                <SlowIndicator resetSettings={jest.fn()} />
            </PerformanceTrackerContext.Provider>
        );

        expect(screen.queryByText("Ticking is slow")).not.toBeInTheDocument();
    });
});