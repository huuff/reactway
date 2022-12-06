import "tailwindcss/tailwind.css";
import { useInterval } from "beautiful-react-hooks";
import CanvasGameGrid from "../src/components/grid/CanvasGameGrid";
import { useGrid } from "../src/game/use-grid";
import NoSSR from "../src/components/util/NoSSR";
import { gridFromAscii } from "../src/util/create-grid-from-ascii";

// TODO: Nicer styles
// TODO: Enable dark mode here
// TODO: Generate the JSX from the grids structure

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
    }
}

type AssortedGrids = {
    [k in keyof typeof INITIAL_GRIDS]: {
        [v in keyof typeof INITIAL_GRIDS[k]]: ReturnType<typeof useGrid>;
    }
};

type GridType = keyof typeof INITIAL_GRIDS;
type GridName = keyof typeof INITIAL_GRIDS[GridType];
// TODO: Can't I at least remove some type assertions?
function createGrids(): AssortedGrids {
    return Object.keys(INITIAL_GRIDS).reduce((result, gridType) => ({
        ...result,
        [gridType]: Object.keys(INITIAL_GRIDS[gridType as GridType]).reduce((gridsOfType, gridName) => ({
            ...gridsOfType,
            [gridName]: useGrid(INITIAL_GRIDS[gridType as GridType][gridName as GridName])
        }), {} as typeof INITIAL_GRIDS[keyof typeof INITIAL_GRIDS])
    }), {} as AssortedGrids);
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

    const oscillators = grids["Oscillators"];
    const blinker = oscillators["Blinker"];
    const toad = oscillators["Toad"];
    const beacon = oscillators["Beacon"];
    const pulsar = oscillators["Pulsar"];
    const pentadecathlon = oscillators["Penta-decathlon"];

    const stillLifes = grids["Still Life"];
    const block = stillLifes["Block"];
    const beehive = stillLifes["Beehive"];
    const loaf = stillLifes["Loaf"];
    const boat = stillLifes["Boat"];
    const tub = stillLifes["Tub"];

    return (
        <>
            <header className="text-lg text-center">Lifeforms</header>
            <main className="flex flex-row justify-evenly">
                <div>
                    Still lifes
                    <div>
                        Block
                        <NoSSR>
                            <CanvasGameGrid grid={block.grid} toggleCell={block.toggleCell} cellSize={2} />
                        </NoSSR>
                    </div>
                    <div>
                        Beehive
                        <NoSSR>
                            <CanvasGameGrid grid={beehive.grid} toggleCell={beehive.toggleCell} cellSize={2} />
                        </NoSSR>
                    </div>
                    <div>
                        Loaf
                        <NoSSR>
                            <CanvasGameGrid grid={loaf.grid} toggleCell={loaf.toggleCell} cellSize={2} />
                        </NoSSR>
                    </div>
                    <div>
                        Boat
                        <NoSSR>
                            <CanvasGameGrid grid={boat.grid} toggleCell={boat.toggleCell} cellSize={2} />
                        </NoSSR>
                    </div>
                    <div>
                        Tub
                        <NoSSR>
                            <CanvasGameGrid grid={tub.grid} toggleCell={tub.toggleCell} cellSize={2} />
                        </NoSSR>
                    </div>
                </div>
                <div>
                    Oscillators
                    <div>
                        Blinker
                        <NoSSR>
                            <CanvasGameGrid grid={blinker.grid} toggleCell={blinker.toggleCell} cellSize={2} />
                        </NoSSR>
                    </div>
                    <div>
                        Toad
                        <NoSSR>
                            <CanvasGameGrid grid={toad.grid} toggleCell={toad.toggleCell} cellSize={2} />
                        </NoSSR>
                    </div>
                    <div>
                        Beacon
                        <NoSSR>
                            <CanvasGameGrid grid={beacon.grid} toggleCell={beacon.toggleCell} cellSize={2} />
                        </NoSSR>
                    </div>
                    <div>
                        Pulsar
                        <NoSSR>
                            <CanvasGameGrid grid={pulsar.grid} toggleCell={pulsar.toggleCell} cellSize={2} />
                        </NoSSR>
                    </div>
                    <div>
                        Penta-decathlon
                        <NoSSR>
                            <CanvasGameGrid grid={pentadecathlon.grid} toggleCell={pentadecathlon.toggleCell} cellSize={2} />
                        </NoSSR>
                    </div>
                </div>
                <div>
                    Spaceships
                </div>
            </main>
        </>
    )
};

export default Lifeforms;