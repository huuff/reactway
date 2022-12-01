declare module "immutable-tuple" {
  export type Tuple = import("type-fest").Opaque<[number, number]>;

  export default function tuple(t1: number, t2: number): Tuple;


}
