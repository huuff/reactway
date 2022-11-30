import { Coordinates } from "../grid/grid";

class Box2D {
    
    constructor(
        public readonly topLeft: Coordinates,
        public readonly bottomRight: Coordinates,
    ) {}

    // TODO: Test
    contains = (coordinates: Coordinates) => {
        const [x, y] = coordinates;
        const [topLeftX, topLeftY] = this.topLeft;
        const [bottomRightX, bottomRightY] = this.bottomRight;

        return (x >= topLeftX && x <= bottomRightX) && (y >= topLeftY && y <= bottomRightY);
    }

    // TODO: Test
    divide = (divisor: number) => new Box2D(
        [Math.floor(this.topLeft[0] / divisor), Math.floor(this.topLeft[1] / divisor) ],
        [Math.ceil(this.bottomRight[0] / divisor), Math.ceil(this.bottomRight[1] / divisor) ],
    )

}

export { Box2D };