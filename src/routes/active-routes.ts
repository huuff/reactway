import { RouteSpec } from "./route-spec";

type SeedRoutePathParams = {
    seed: string;
}

const seedRoute = new RouteSpec<SeedRoutePathParams, {}>("/seed/:seed");

export { seedRoute };
export type { SeedRoutePathParams };