import { GameSettingsQueryParams } from "../game/settings";
import { RouteSpec } from "./route-spec";

type SeedRoutePathParams = {
    seed: string;
}

const seedRoute = new RouteSpec<SeedRoutePathParams, GameSettingsQueryParams>("/seed/:seed");

export { seedRoute };
export type { SeedRoutePathParams };