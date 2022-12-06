import "tailwindcss/tailwind.css";
import { useInterval } from "beautiful-react-hooks";
import CanvasGameGrid from "../src/components/grid/CanvasGameGrid";
import { useGrid } from "../src/game/use-grid";
import NoSSR from "../src/components/util/NoSSR";
import { gridFromAscii } from "../src/util/create-grid-from-ascii";
import { typesafeKeys } from "../src/util/typesafe-keys";
import { ReactElement } from "react";

// TODO: Nicer styles
// TODO: Enable dark mode here
// TODO: Try to draw the spaceships in a dragscrollable small container and a grid that's larger than it, so you
// can follow the course of the spaceship by dragscrolling

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
            OOOOO
            OO#OO
            #O#OO
            O##OO
            OOOOO
        `,
        "Lightweight Spaceship": gridFromAscii`
            OOOOOOOOO
            OO#OO#OOO
            OOOOOO#OO
            OO#OOO#OO
            OOO####OO
            OOOOOOOOO
            OOOOOOOOO
        `,
        "Middleweight Spaceship": gridFromAscii`
            OOOOOOOOOO
            OOOOOOOOOO
            OOOOOOOOOO
            OOO#####OO
            OO#OOOO#OO
            OOOOOOO#OO
            OO#OOO#OOO
            OOOO#OOOOO
            OOOOOOOOOO
        `,
        "Heavyweight Spaceship": gridFromAscii`
            OOOOOOOOOOO
            OOOOOOOOOOO
            OOOOOOOOOOO
            OOO######OO
            OO#OOOOO#OO
            OOOOOOOO#OO
            OO#OOOO#OOO
            OOOO##OOOOO
            OOOOOOOOOOO
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

function renderGrids(grids: AssortedGrids, lifeformType: keyof AssortedGrids): ReactElement {
    return (
        <div>
            {lifeformType}
            {Object.entries(grids[lifeformType]).map(([lifeformName, lifeform]) => (
                <div>
                    {lifeformName}
                    <NoSSR>
                        <CanvasGameGrid grid={lifeform.grid} toggleCell={lifeform.toggleCell} cellSize={2} />
                    </NoSSR>
                </div>
            ))}
        </div>
    )
}

const Lifeforms = () => {
    const grids = createGrids();

    useInterval(() => {
        Object.values(grids).forEach((gridType) => {
            Object.values(gridType).forEach((grid) => {
                grid.tick();
            });
        });
    }, 1000);

    return (
        <>
            <header className="text-lg text-center">Lifeforms</header>
            <main className="flex flex-row justify-evenly">
                { renderGrids(grids, "Still Life") }
                { renderGrids(grids, "Oscillators") }
                { renderGrids(grids, "Spaceships") }
            </main>
        </>
    )
};

export default Lifeforms;