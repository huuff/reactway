import "tailwindcss/tailwind.css";
import { useInterval } from "beautiful-react-hooks";
import tuple from "immutable-tuple";
import CanvasGameGrid from "../src/components/grid/CanvasGameGrid";
import { useGrid } from "../src/game/use-grid";
import { SetGrid } from "../src/grid/set-grid";
import NoSSR from "../src/components/util/NoSSR";
import { gridFromAscii } from "../src/util/create-grid-from-ascii";

const Lifeforms = () => {
    const {
        grid: blinkerGrid, 
        tick: tickBlinker,
        toggleCell: toggleBlinkerCell
     } = useGrid(gridFromAscii`
        OOOOO
        OOOOO
        O###O
        OOOOO
        OOOOO
     `);

     const {
        grid: toadGrid,
        tick: tickToad,
        toggleCell: toggleToadCell,
     } = useGrid(gridFromAscii`
        OOOOOO
        OOOOOO
        OO###O
        O###OO
        OOOOOO
        OOOOOO
     `);

    const {
        grid: beaconGrid,
        tick: tickBeacon,
        toggleCell: toggleBeaconCell,
    } = useGrid(gridFromAscii`
        OOOOOO
        O##OOO
        O##OOO
        OOO##O
        OOO##O
        OOOOOO
    `);
    
    const {
        grid: pulsarGrid,
        tick: tickPulsar,
        toggleCell: togglePulsarCell,
    } = useGrid(gridFromAscii`
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
    `);

    const {
        grid: pentadecathlonGrid,
        tick: tickPentadecathlon,
        toggleCell: togglePentadecathlonCell,
    } = useGrid(gridFromAscii`
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
    `);

     useInterval(() => {
        tickBlinker();
        tickToad();
        tickBeacon();
        tickPulsar();
        tickPentadecathlon();
     }, 1000);

    return (
        <>
            <header className="text-lg text-center">Lifeforms</header>
            <main className="columns-3 gap-8">
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan={2}>Oscillators</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Blinker</td>
                                <td>
                                    <NoSSR>
                                        <CanvasGameGrid grid={blinkerGrid} toggleCell={toggleBlinkerCell} cellSize={2}/>
                                    </NoSSR>
                                </td>
                            </tr>
                            <tr>
                                <td>Toad</td>
                                <td>
                                    <NoSSR>
                                        <CanvasGameGrid grid={toadGrid} toggleCell={toggleToadCell} cellSize={2} />
                                    </NoSSR>
                                </td>
                            </tr>
                            <tr>
                                <td>Beacon</td>
                                <td>
                                    <NoSSR>
                                        <CanvasGameGrid grid={beaconGrid} toggleCell={toggleBeaconCell} cellSize={2} />
                                    </NoSSR>
                                </td>
                            </tr>
                            <tr>
                                <td>Pulsar</td>
                                <td>
                                    <NoSSR>
                                        <CanvasGameGrid grid={pulsarGrid} toggleCell={togglePulsarCell} cellSize={2} />
                                    </NoSSR>
                                </td>
                            </tr>
                            <tr>
                                <td>Penta-decathlon</td>
                                <td>
                                    <NoSSR>
                                        <CanvasGameGrid grid={pentadecathlonGrid} toggleCell={togglePentadecathlonCell} cellSize={2} />
                                    </NoSSR>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                </div>
                
            </main>
        </>
    )
};

export default Lifeforms;