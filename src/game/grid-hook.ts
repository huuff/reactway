import { Dispatch, SetStateAction } from "react";
import { Grid } from "./grid"

type GridHook<T extends Grid> = [grid: T, setGrid: Dispatch<SetStateAction<T>>];

type UseGridHook<T extends Grid> = (height: number, width: number, birthFactor: number) => GridHook<T>;

export type { GridHook, UseGridHook };