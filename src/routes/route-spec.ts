class RouteSpec<PathParams, QueryParams> {
    
    constructor(public readonly base: string) {

    }

    build(pathParams: PathParams, queryParams: QueryParams): string {
        let result = this.base;

        for (const key in pathParams) {
            result = result.replaceAll(`:${key}`, String(pathParams[key]))
        }

        if (queryParams) {
            result += "?"
            result += Object.entries(queryParams)
                            .map(([key, value]) => `${key}=${String(value)}`)
                            .join("&")
        }

        return result;
    }
}

export { RouteSpec }