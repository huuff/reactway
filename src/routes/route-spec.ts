type BaseParamsType = {
    [key: string]: string
}

class RouteSpec<PathParams extends BaseParamsType, QueryParams extends BaseParamsType> {
    
    constructor(public readonly base: string) {

    }

    // TODO: Implement query params
    build(pathParams: PathParams, queryParams: QueryParams): string {
        let result = this.base;

        for (const key in pathParams) {
            result = result.replaceAll(`:${key}`, pathParams[key])
        }

        return result;
    }
}

export { RouteSpec }