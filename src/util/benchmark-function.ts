const benchmark = (name: string, f: () => void) => {
    const startTime = performance.now();
    f();
    const endTime = performance.now();
    const elapsedMillis = endTime - startTime;

    console.log(`${name} took ${elapsedMillis}ms`);
}

export { benchmark };