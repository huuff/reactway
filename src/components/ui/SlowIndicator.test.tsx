import { render, screen } from "@testing-library/react";
import { PerformanceTracker, PerformanceTrackerContext } from "../../hooks/use-performance-tracker";
import SlowIndicator from "./SlowIndicator";

const fakePerformanceTracker: PerformanceTracker = {
    isSlow: false,
    averageOverhead: 0,
    recordSample: jest.fn(),
    disabledFeatures: [],
    isDisabled: jest.fn(),
    updateBatches: jest.fn(),
    reset: jest.fn(),
};

describe("SlowIndicator", () => {

    test("it doesn't show when there are no performance issues", () => {
        render(
            <PerformanceTrackerContext.Provider value={fakePerformanceTracker}>
                <SlowIndicator resetSettings={jest.fn()} />
            </PerformanceTrackerContext.Provider>
        );

        expect(screen.queryByText("Ticking is slow")).not.toBeInTheDocument();
    });

    test("it shows when ticking is slow", () => {
        const slowTracker = { ...fakePerformanceTracker, isSlow: true };

        render(
            <PerformanceTrackerContext.Provider value={slowTracker}>
                <SlowIndicator resetSettings={jest.fn()} />
            </PerformanceTrackerContext.Provider>
        );

        expect(screen.queryByText("Ticking is slow")).toBeInTheDocument();
    });
});