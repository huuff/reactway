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