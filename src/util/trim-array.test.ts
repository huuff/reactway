import { trimArray } from "./trim-array";

describe("trimArray", () => {
    test("trims arrays longer than prescribed length", () => {
        // ARRANGE
        const initialArray = [1, 2, 3, 4, 5];

        // ACT
        const { array, newLength } = trimArray(initialArray, 3);

        // ASSERT
        expect(array).toEqual([3, 4, 5]);
        expect(newLength).toBe(3);
    });

    test("doesn't trim array outside of the prescribed length", () => {
        // ARRANGE
        const initialArray = [1, 2];

        // ACT
        const { array, newLength } = trimArray(initialArray, 3);

        // ASSERT
        expect(array).toEqual([1, 2]);
        expect(newLength).toBe(2);
    });
});