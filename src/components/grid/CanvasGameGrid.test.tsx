import CanvasGameGrid from "./CanvasGameGrid";
import renderer from "react-test-renderer";
import { Coordinates } from "../../grid/grid";
import { SetGrid } from "../../grid/set-grid";

const liveCells: Coordinates[] = [[2, 3], [2, 1], [3, 2], [3,3], [4, 2]];
describe("CanvasGameGrid", () => {
    test("snapshot", () => {
        expect(renderer.create(
            <CanvasGameGrid grid={new SetGrid(liveCells)} toggleCell={jest.fn()} />
        ).toJSON()).toMatchSnapshot();
    });
});