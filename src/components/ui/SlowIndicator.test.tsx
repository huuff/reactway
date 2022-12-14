import { fireEvent, render, screen } from "@testing-library/react";
import { PerformanceTracker, PerformanceTrackerContext } from "../../hooks/use-performance-tracker";
import { SettingsContext } from "../../settings/settings";
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
                <SettingsContext.Provider value={[expect.any(Object), jest.fn()]}>
                    <SlowIndicator/>
                </SettingsContext.Provider>
            </PerformanceTrackerContext.Provider>
        );

        expect(screen.queryByText("Ticking is slow")).not.toBeInTheDocument();
    });

    test("it shows when ticking is slow", () => {
        const slowTracker = { ...fakePerformanceTracker, isSlow: true };

        render(
            <PerformanceTrackerContext.Provider value={slowTracker}>
                <SettingsContext.Provider value={[expect.any(Object), jest.fn()]}>
                    <SlowIndicator />
                </SettingsContext.Provider>
            </PerformanceTrackerContext.Provider>
        );

        expect(screen.queryByText("Ticking is slow")).toBeInTheDocument();
    });

    test("no list of disabled features is shown when there are none", () => {
        const slowTracker = { ...fakePerformanceTracker, isSlow: true, disabledFeatures: [] };

        render(
            <PerformanceTrackerContext.Provider value={slowTracker}>
                <SettingsContext.Provider value={[expect.any(Object), jest.fn()]}>
                    <SlowIndicator />
                </SettingsContext.Provider>
            </PerformanceTrackerContext.Provider>
        );

        expect(screen.queryAllByRole("listitem")).toStrictEqual([]);
    });

    test("disabled features are shown", () => {
        const trackerWithDisabledFeatures: PerformanceTracker = {
            ...fakePerformanceTracker,
            isSlow: true,
            disabledFeatures: [
                {
                    name: "hover",
                    description: "first disabled feature",
                    expectedSavedMs: 0
                },
                {
                    name: "visible",
                    description: "second disabled feature",
                    expectedSavedMs: 0,
                }
            ],
        };

        render(
            <PerformanceTrackerContext.Provider value={trackerWithDisabledFeatures}>
                <SettingsContext.Provider value={[expect.any(Object), jest.fn()]}>
                    <SlowIndicator />
                </SettingsContext.Provider>
            </PerformanceTrackerContext.Provider>
        );

        const items = screen.queryAllByRole("listitem");
        expect(items[0]).toHaveTextContent(trackerWithDisabledFeatures.disabledFeatures[0].description);
        expect(items[1]).toHaveTextContent(trackerWithDisabledFeatures.disabledFeatures[1].description);
    });

    test("clicking on the reset button resets settings", () => {
        const slowTracker = { ...fakePerformanceTracker, isSlow: true };
        const dispatchSettings = jest.fn();

        render(
            <PerformanceTrackerContext.Provider value={slowTracker}>
                <SettingsContext.Provider value={[expect.any(Object), dispatchSettings]}>
                    <SlowIndicator />
                </SettingsContext.Provider>
            </PerformanceTrackerContext.Provider>
        );

        fireEvent.click(screen.getByText(/Click here/), { bubbles: true });
        expect(dispatchSettings).toHaveBeenCalledWith({type: "reset"});
    });

    test("dismissing", () => {
        const slowTracker = { ...fakePerformanceTracker, isSlow: true };
        
        render(
            <PerformanceTrackerContext.Provider value={slowTracker}>
                <SlowIndicator />
            </PerformanceTrackerContext.Provider>
        );

        // Sanity check: It's initally shown
        expect(screen.queryByText(/Ticking is slow/)).toBeInTheDocument();

        fireEvent.click(screen.getByRole("close"), { bubbles: true} );

        expect(screen.queryByText(/Ticking is slow/)).not.toBeInTheDocument();
    });
});