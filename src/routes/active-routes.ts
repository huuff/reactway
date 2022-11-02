import { GameSettings } from "../game/settings";
import { RouteSpec } from "./route-spec";

type SeedRoutePathParams = {
    seed: string;
}

type SeedRouteQueryParams = Partial<GameSettings>

const seedRoute = new RouteSpec<SeedRoutePathParams, SeedRouteQueryParams>("/seed/:seed");

export { seedRoute };
export type { SeedRoutePathParams };