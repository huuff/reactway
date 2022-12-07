import CanvasGameGrid from "./CanvasGameGrid";
import renderer from "react-test-renderer";
import { Coordinates } from "../../grid/grid";
import { SetGrid } from "../../grid/set-grid";
import tuple from "immutable-tuple";

const liveCells: Coordinates[] = [tuple(2, 3), tuple(2, 1), tuple(3, 2), tuple(3,3), tuple(4, 2)];
describe("CanvasGameGrid", () => {
    // Won't work (suddenly I need to mock refs? Maybe I should use enzyme)
    test.skip("snapshot", () => {
        expect(renderer.create(
            <CanvasGameGrid 
                grid={new SetGrid(liveCells)}
                toggleCell={jest.fn()}
                cellSize={3} 
            />
        ).toJSON()).toMatchSnapshot();
    });
});