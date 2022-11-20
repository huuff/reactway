import { Dispatch, SetStateAction, useState } from "react";
import { ConwayStrategy } from "../game/conway-strategy";
import { Grid } from "./grid";

type GridState = {
    readonly grid: Grid;
    readonly tick: () => void;
    readonly setGrid: Dispatch<SetStateAction<Grid>>;
    readonly conwayStrategy: ConwayStrategy;
    readonly setConwayStrategy: (newConwayStrategy: ConwayStrategy) => void;
}

function useGrid(initialGrid: Grid, initialConwayStrategy: ConwayStrategy): GridState {
    const [grid, setGrid] = useState(initialGrid);
    const [conwayStrategy, setConwayStrategy] = useState(() => initialConwayStrategy);

    const actualSetConwayStrategy  
        = (newConwayStrategy: ConwayStrategy) => setConwayStrategy(() => newConwayStrategy);

    const tick = () => {
        setGrid(grid => grid.tick(initialConwayStrategy));
    };

    return {
        grid,
        setGrid,
        tick,
        conwayStrategy,
        setConwayStrategy: actualSetConwayStrategy,
    }
}

export { useGrid };