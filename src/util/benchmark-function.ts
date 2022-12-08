type BenchmarkResult<T> = {
    result: T;
    elapsedMs: number;
}

const benchmark = <T>(f: () => T, logToConsole = false, name?: string): BenchmarkResult<T> => {
    const startTime = performance.now();
    const result = f();
    const endTime = performance.now();
    const elapsedMs = endTime - startTime;

    logToConsole && console.log(`${name} took ${elapsedMs}ms`);
    return { result, elapsedMs };
}

export { benchmark };