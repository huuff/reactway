import seedrandom from "seedrandom";
import { v4 as uuid } from "uuid";

// TODO: In the `util` folder?
function shouldBeBornAlive(seedrandom: seedrandom.PRNG, birthFactor: number): boolean {
    return seedrandom() < birthFactor;
}

function randomSeed(): string {
    return uuid();
}

export { shouldBeBornAlive, randomSeed };