class RouteSpec<PathParams, QueryParams> {
    
    constructor(public readonly base: string) {

    }

    // TODO: Implement query params
    build(pathParams: PathParams, queryParams: QueryParams): string {
        let result = this.base;

        for (const key in pathParams) {
            result = result.replaceAll(`:${key}`, String(pathParams[key]))
        }

        return result;
    }
}

export { RouteSpec }