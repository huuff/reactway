import tuple from "immutable-tuple";
import { coordinatesToString, stringToCoordinates } from "./coordinates-to-string";

describe("coordinates <-> string conversions", () => {
    test("coordinatesToString", () => {
        expect(coordinatesToString(tuple(2, 2))).toBe("(2,2)");
    });

    test("stringToCoordinates", () => {
        const [x, y] = stringToCoordinates("(2,2)");

        expect(x).toBe(2);
        expect(y).toBe(2);
    });
});