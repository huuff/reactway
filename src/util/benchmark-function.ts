type BenchmarkResult<T> = {
    readonly result: T;
    readonly elapsedMs: number;
}

type BenchmarkOptions = {
    readonly logToConsole?: boolean;
    readonly name?: string;
}

const benchmark = <T>(f: () => T, { logToConsole, name }: BenchmarkOptions = {}): BenchmarkResult<T> => {
    const startTime = performance.now();
    const result = f();
    const endTime = performance.now();
    const elapsedMs = endTime - startTime;

    logToConsole && console.log(`${name} took ${elapsedMs}ms`);
    return { result, elapsedMs };
};

export { benchmark };