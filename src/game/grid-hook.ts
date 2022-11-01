import { Dispatch, SetStateAction } from "react";
import { Grid } from "./grid"

type GridHook<T extends Grid<T>> = [grid: T, setGrid: Dispatch<SetStateAction<T>>];

type UseGridHook<T extends Grid<T>> = (height: number, width: number, birthFactor: number) => GridHook<T>;

export type { GridHook, UseGridHook };