import classNames from "classnames";
import { useMemo } from "react";
import { useDarkMode, useInterval } from "usehooks-ts";
import CanvasGameGrid from "../src/components/grid/CanvasGameGrid";
import DarkModeSelector from "../src/components/settings/DarkModeSelector";
import SlowIndicator from "../src/components/ui/SlowIndicator";
import { useGrid } from "../src/game/use-grid";
import { gridFromAscii } from "../src/util/create-grid-from-ascii";
import { getTheme } from "../src/util/get-theme";

const Gun = () => {
    const { isDarkMode } = useDarkMode();
    const theme = getTheme(isDarkMode);

    const initialGrid = useMemo(() => {
        return gridFromAscii`
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOO#OOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOO#O#OOOOOOOOOOOO
        OOOOOOOOOOOOO##OOOOOO##OOOOOOOOOOOO##O
        OOOOOOOOOOOO#OOO#OOOO##OOOOOOOOOOOO##O
        O##OOOOOOOO#OOOOO#OOO##OOOOOOOOOOOOOOO
        O##OOOOOOOO#OOO#O##OOOO#O#OOOOOOOOOOOO
        OOOOOOOOOOO#OOOOO#OOOOOOO#OOOOOOOOOOOO
        OOOOOOOOOOOO#OOO#OOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOO##OOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        `;
    }, []);

    const { grid, toggleCell, tick } = useGrid(initialGrid);

    useInterval(() => {
        tick();
    }, 1000);

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
        </main>
    </div>
    );
};

export default Gun;