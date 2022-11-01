import { RouteSpec } from "./route-spec";

const seedRoute = new RouteSpec<{ seed: string }, {}>("/seed/:seed");

export { seedRoute };