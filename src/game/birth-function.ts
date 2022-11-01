import seedrandom from "seedrandom"

function shouldBeBornAlive(seedrandom: seedrandom.PRNG, birthFactor: number): boolean {
    return seedrandom() < birthFactor;
}

function randomSeed(): string {
    return Math.random.toString()
}

export { shouldBeBornAlive, randomSeed };