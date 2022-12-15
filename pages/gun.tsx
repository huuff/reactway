import classNames from "classnames";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useDarkMode, useInterval } from "usehooks-ts";
import CanvasGameGrid from "../src/components/grid/CanvasGameGrid";
import DarkModeSelector from "../src/components/settings/DarkModeSelector";
import SlowIndicator from "../src/components/ui/SlowIndicator";
import { useGrid } from "../src/game/use-grid";
import { gridFromAscii } from "../src/util/create-grid-from-ascii";
import { getTheme } from "../src/util/get-theme";
import clamp from "lodash/clamp";

const Gun = () => {
    const { isDarkMode } = useDarkMode();
    const theme = getTheme(isDarkMode);

    const initialGrid = useMemo(() => {
        return gridFromAscii`
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOO#OOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOO#O#OOOOOOOOOOOOO
        OOOOOOOOOOOOO##OOOOOO##OOOOOOOOOOOO##OO
        OOOOOOOOOOOO#OOO#OOOO##OOOOOOOOOOOO##OO
        O##OOOOOOOO#OOOOO#OOO##OOOOOOOOOOOOOOOO
        O##OOOOOOOO#OOO#O##OOOO#O#OOOOOOOOOOOOO
        OOOOOOOOOOO#OOOOO#OOOOOOO#OOOOOOOOOOOOO
        OOOOOOOOOOOO#OOO#OOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOO##OOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        `;
    }, []);

    const { grid, toggleCell, tick } = useGrid(initialGrid);

    const [ intervalMultiplier, setIntervalMultiplier ] = useState(1);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log("Handling change");
        setIntervalMultiplier(clamp(+e.target.value, -10, 10));
    };

    const actualMultiplier = useMemo(() => {
        if (intervalMultiplier < 0) {
            return -(intervalMultiplier);
        } else if (intervalMultiplier > 0) {
            return 1/intervalMultiplier;
        } else {
            return 1;
        }
    }, [intervalMultiplier]);

    useInterval(() => {
        tick();
    }, actualMultiplier && 1000 * actualMultiplier);

    return (
        <div className={`min-h-screen bg-${theme.windowBackground.className}`}>
        <DarkModeSelector />
        <SlowIndicator resetSettings={() => {}}/>
        <header className={classNames(
            "text-3xl",
            "font-bold",
            "text-center", 
            "mb-10",
            `text-${theme.text.className}`,
            )}
        >Gosper glider gun</header>
        <main>
            <CanvasGameGrid grid={grid} toggleCell={toggleCell} cellSize={2}/>
            <div className="text-center mt-5 flex flex-col w-40 mx-auto">
                <p className={`text-${theme.text.className}`}>Speed</p>
                <input type="range" min={-10} step={1} max={10} value={intervalMultiplier} onChange={handleChange}/>
            </div>
        </main>
    </div>
    );
};

export default Gun;