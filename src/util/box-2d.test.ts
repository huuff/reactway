import { Box2D } from "./box-2d";
import tuple from "immutable-tuple";

describe("Box2D", () => {
    describe("contains", () => {
        const box = new Box2D(tuple(0, 0), tuple(5, 5));

        test("detects contained point", () => {
            expect(box.contains(tuple(2, 2))).toBe(true);
        });
        
        test("detects uncontained point", () => {
            expect(box.contains(tuple(6, 6))).toBe(false);
        });
    });
});