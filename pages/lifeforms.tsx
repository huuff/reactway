import "tailwindcss/tailwind.css";
import { useInterval } from "beautiful-react-hooks";
import tuple from "immutable-tuple";
import CanvasGameGrid from "../src/components/grid/CanvasGameGrid";
import { useGrid } from "../src/game/use-grid";
import { SetGrid } from "../src/grid/set-grid";
import NoSSR from "../src/components/util/NoSSR";

const Lifeforms = () => {
    const {
        grid: blinkerGrid, 
        tick: tickBlinker,
        toggleCell: toggleBlinkerCell
     } = useGrid(new SetGrid([
        tuple(1,2), tuple(2, 2), tuple(3, 2)
    ], 5, 5));

     const {
        grid: toadGrid,
        tick: tickToad,
        toggleCell: toggleToadCell,
     } = useGrid(new SetGrid([
            tuple(2, 2), tuple(3, 2), tuple(4,2),
        tuple(1, 3), tuple(2, 3), tuple(3, 3)
    ], 6, 6))

    const {
        grid: beaconGrid,
        tick: tickBeacon,
        toggleCell: toggleBeaconCell,
    } = useGrid(new SetGrid([
        tuple(1, 1), tuple(2, 1),
        tuple(1, 2), tuple(2, 2),
                                tuple(3, 3), tuple(4, 3),
                                tuple(3, 4), tuple(4, 4),
    ], 6, 6))

     useInterval(() => {
        tickBlinker();
        tickToad();
        tickBeacon();
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
                                        <CanvasGameGrid grid={blinkerGrid} toggleCell={toggleBlinkerCell} cellSize={3}/>
                                    </NoSSR>
                                </td>
                            </tr>
                            <tr>
                                <td>Toad</td>
                                <td>
                                    <NoSSR>
                                        <CanvasGameGrid grid={toadGrid} toggleCell={toggleToadCell} cellSize={3} />
                                    </NoSSR>
                                </td>
                            </tr>
                            <tr>
                                <td>Beacon</td>
                                <td>
                                    <NoSSR>
                                        <CanvasGameGrid grid={beaconGrid} toggleCell={toggleBeaconCell} cellSize={3} />
                                    </NoSSR>
                                </td>
                            </tr>
                            <tr>
                                <td>Pulsar</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Penta-decathlon</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                    
                </div>
                
            </main>
        </>
    )
};

export default Lifeforms;