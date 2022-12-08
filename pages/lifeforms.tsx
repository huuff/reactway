import { useInterval } from "beautiful-react-hooks";
import CanvasGameGrid from "../src/components/grid/CanvasGameGrid";
import { useGrid } from "../src/game/use-grid";
import NoSSR from "../src/components/util/NoSSR";
import { gridFromAscii } from "../src/util/create-grid-from-ascii";
import { typesafeKeys } from "../src/util/typesafe-keys";
import { ReactElement, useMemo } from "react";
import { useDarkMode } from "usehooks-ts";
import { getTheme, Theme } from "../src/util/get-theme";
import classNames from "classnames";
import DarkModeSelector from "../src/components/settings/DarkModeSelector";
import ScrollContainer from "react-indiana-drag-scroll";


// TODO: Make this responsive
const INITIAL_GRIDS = {
    "Still Life": {
        "Block": gridFromAscii`
            OOOO
            O##O
            O##O
            OOOO
        `,
        "Beehive": gridFromAscii`
            OOOOOO
            OO##OO
            O#OO#O
            OO##OO
            OOOOOO
        `,
        "Loaf": gridFromAscii`
            OOOOOO
            OO##OO
            O#OO#O
            OO#O#O
            OOO#OO
            OOOOOO
        `,
        "Boat": gridFromAscii`
            OOOOO
            O##OO
            O#O#O
            OO#OO
            OOOOO
        `,
        "Tub": gridFromAscii`
            OOOOO
            OO#OO
            O#O#O
            OO#OO
            OOOOO
        `,
    },
    "Oscillators": {
        "Blinker": gridFromAscii`
                        OOOOO
                        OOOOO
                        O###O
                        OOOOO
                        OOOOO
                    `,
        "Toad": gridFromAscii`
                    OOOOOO
                    OOOOOO
                    OO###O
                    O###OO
                    OOOOOO
                    OOOOOO
                    `,
        "Beacon": gridFromAscii`
                    OOOOOO
                    O##OOO
                    O##OOO
                    OOO##O
                    OOO##O
                    OOOOOO
                    `,
        "Pulsar": gridFromAscii`
                    OOOOOOOOOOOOOOOOO
                    OOOOOOOOOOOOOOOOO
                    OOOO###OOO###OOOO
                    OOOOOOOOOOOOOOOOO
                    OO#OOOO#O#OOOO#OO
                    OO#OOOO#O#OOOO#OO
                    OO#OOOO#O#OOOO#OO
                    OOOO###OOO###OOOO
                    OOOOOOOOOOOOOOOOO
                    OOOO###OOO###OOOO
                    OO#OOOO#O#OOOO#OO
                    OO#OOOO#O#OOOO#OO
                    OO#OOOO#O#OOOO#OO
                    OOOOOOOOOOOOOOOOO
                    OOOO###OOO###OOOO
                    OOOOOOOOOOOOOOOOO
                    OOOOOOOOOOOOOOOOO
                    `,
        "Penta-decathlon": gridFromAscii`
                    OOOOOOOOOOO
                    OOOOOOOOOOO
                    OOOOOOOOOOO
                    OOOO###OOOO
                    OOOOO#OOOOO
                    OOOOO#OOOOO
                    OOOO###OOOO
                    OOOOOOOOOOO
                    OOOO###OOOO
                    OOOO###OOOO
                    OOOOOOOOOOO
                    OOOO###OOOO
                    OOOOO#OOOOO
                    OOOOO#OOOOO
                    OOOO###OOOO
                    OOOOOOOOOOO
                    OOOOOOOOOOO
                    OOOOOOOOOOO
                    `,
    },
    "Spaceships": {
        "Glider": gridFromAscii`
            OOOOOOOOOOOOO
            OO#OOOOOOOOOO
            #O#OOOOOOOOOO
            O##OOOOOOOOOO
            OOOOOOOOOOOOO
            OOOOOOOOOOOOO
            OOOOOOOOOOOOO
            OOOOOOOOOOOOO
            OOOOOOOOOOOOO
            OOOOOOOOOOOOO
        `,
        "Lightweight Spaceship": gridFromAscii`
            OOOOOOOOOOOOOO
            OO#OO#OOOOOOOO
            OOOOOO#OOOOOOO
            OO#OOO#OOOOOOO
            OOO####OOOOOOO
            OOOOOOOOOOOOOO
        `,
        "Middleweight Spaceship": gridFromAscii`
            OOOOOOOOOOOOOOO
            OOOOOOOOOOOOOOO
            OOOOOOOOOOOOOOO
            OOO#####OOOOOOO
            OO#OOOO#OOOOOOO
            OOOOOOO#OOOOOOO
            OO#OOO#OOOOOOOO
            OOOO#OOOOOOOOOO
            OOOOOOOOOOOOOOO
            OOOOOOOOOOOOOOO
        `,
        "Heavyweight Spaceship": gridFromAscii`
            OOOOOOOOOOOOOOOOO
            OOOOOOOOOOOOOOOOO
            OOOOOOOOOOOOOOOOO
            OOO######OOOOOOOO
            OO#OOOOO#OOOOOOOO
            OOOOOOOO#OOOOOOOO
            OO#OOOO#OOOOOOOOO
            OOOO##OOOOOOOOOOO
            OOOOOOOOOOOOOOOOO
        `,
    }
}

type AssortedGrids = {
    [k in keyof typeof INITIAL_GRIDS]: {
        [v in keyof typeof INITIAL_GRIDS[k]]: ReturnType<typeof useGrid>;
    }
};

function createGrids(): AssortedGrids {
    return typesafeKeys(INITIAL_GRIDS).reduce((result, gridType) => ({
        ...result,
        [gridType]: typesafeKeys(INITIAL_GRIDS[gridType]).reduce((gridsOfType, gridName) => ({
            ...gridsOfType,
            [gridName]: useGrid(INITIAL_GRIDS[gridType][gridName])
        }), {} as typeof INITIAL_GRIDS[keyof typeof INITIAL_GRIDS])
    }), {} as AssortedGrids);
}

function renderGrids(grids: AssortedGrids, lifeformType: keyof AssortedGrids, theme: Theme): ReactElement {
    return (
        <section className="basis-1/6">
            <h2 className={`text-xl text-center mb-2 font-semibold text-${theme.text.className}`}>{lifeformType}</h2>
            <div className={classNames(
                `bg-${theme.input.className}`, // XXX: Not really an input though!!
                "rounded-lg",
                "px-3",
                "pb-4",
                "shadow-lg",
                )}>

                {Object.entries(grids[lifeformType]).map(([lifeformName, lifeform]) => (
                    <div key={lifeformName}>
                        <h3 className={`text-lg text-center mt-2 font-semibold text-${theme.text.className}`}>{lifeformName}</h3>
                        <NoSSR>
                            { lifeformType === "Spaceships"
                                ? <ScrollContainer className="w-40 h-25 mx-auto cursor-move">
                                    <CanvasGameGrid grid={lifeform.grid} toggleCell={lifeform.toggleCell} cellSize={2} />
                                  </ScrollContainer>
                                : <CanvasGameGrid grid={lifeform.grid} toggleCell={lifeform.toggleCell} cellSize={2} />
                            }
                            
                        </NoSSR>
                    </div>
                ))}

            </div>
        </section>
    )
}

const Lifeforms = () => {
    const grids = createGrids();
    const { isDarkMode } = useDarkMode();
    const theme = useMemo(() => getTheme(isDarkMode), [isDarkMode]);

    useInterval(() => {
        Object.values(grids).forEach((gridType) => {
            Object.values(gridType).forEach((grid) => {
                grid.tick();
            });
        });
    }, 1000);

    return (
        <>
            <div className={`min-h-screen bg-${theme.windowBackground.className}`}>
                <DarkModeSelector />
                <header className={classNames(
                    "text-3xl",
                    "font-bold",
                    "text-center", 
                    "mb-10",
                    `text-${theme.text.className}`,
                    )}>Lifeforms</header>
                <main className="flex flex-row justify-evenly">
                    {renderGrids(grids, "Still Life", theme)}
                    {renderGrids(grids, "Oscillators", theme)}
                    {renderGrids(grids, "Spaceships", theme)}
                </main>
            </div>
        </>
    )
};

export default Lifeforms;