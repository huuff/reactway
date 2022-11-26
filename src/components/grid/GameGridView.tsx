import { GameGridProps } from "../../grid/grid";
import { GridViewType } from "../../settings/settings";
import AsciiGameGrid from "./AsciiGameGrid";
import CanvasGameGrid from "./CanvasGameGrid";
import TableGameGrid from "./TableGameGrid";

const GameGridView = (props: (GameGridProps & { view: GridViewType})) => {
    switch (props.view) {
        case "table":
            return <TableGameGrid {...props} className="mx-auto" />
        case "ascii":
            return <AsciiGameGrid {...props} className="text-center" />
        case "canvas":
            return <CanvasGameGrid {...props} className="mx-auto" />
    }
}

export default GameGridView;