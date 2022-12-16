import classNames from "classnames";
import { ChangeEvent, useMemo, useState } from "react";
import { useInterval } from "usehooks-ts";
import CanvasGameGrid from "../src/components/grid/CanvasGameGrid";
import { useGrid } from "../src/game/use-grid";
import { gridFromAscii } from "../src/util/create-grid-from-ascii";
import { getTheme } from "../src/util/get-theme";
import clamp from "lodash/clamp";
import ScrollContainer from "react-indiana-drag-scroll";
import { useDarkMode } from "../src/hooks/use-dark-mode";

const Gun = () => {
    const { isDarkMode } = useDarkMode();
    const theme = getTheme(isDarkMode);

    const initialGrid = useMemo(() => {
        return gridFromAscii`
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOO#OOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOO#O#OOOOOOOOOOOOOOOO
        OOOOOOOOOOOOO##OOOOOO##OOOOOOOOOOOO##OOOOO
        OOOOOOOOOOOO#OOO#OOOO##OOOOOOOOOOOO##OOOOO
        O##OOOOOOOO#OOOOO#OOO##OOOOOOOOOOOOOOOOOOO
        O##OOOOOOOO#OOO#O##OOOO#O#OOOOOOOOOOOOOOOO
        OOOOOOOOOOO#OOOOO#OOOOOOO#OOOOOOOOOOOOOOOO
        OOOOOOOOOOOO#OOO#OOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOO##OOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
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
        <header className={classNames(
            "text-3xl",
            "font-bold",
            "text-center", 
            "mb-8",
            `text-${theme.text.className}`,
            )}
        >Gosper glider gun</header>
        <p className={classNames(
            "font-light",
            "italic",
            "text-center", 
            "mb-5",
            "sm:px-24",
            "md:px-48",
            `text-${theme.text.className}`,
            )}>
            The glider gun releases an endless stream of gliders that wander into the void.
            <br/>
            Sit back, relax, and enjoy the beauty of such a device.
        </p>
        <main>
            <ScrollContainer className="h-52 mx-auto cursor-move">
                <CanvasGameGrid grid={grid} toggleCell={toggleCell} cellSize={2}/>
            </ScrollContainer>
            <div className="text-center mt-5 flex flex-col w-40 mx-auto">
                <p className={`text-${theme.text.className}`}>Speed</p>
                <input type="range" min={-10} step={1} max={10} value={intervalMultiplier} onChange={handleChange}/>
            </div>
        </main>
    </div>
    );
};

export default Gun;