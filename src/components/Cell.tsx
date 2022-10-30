import { ReactNode } from "react";

type CellProps = {
    isAlive: boolean;
    deadElement: ReactNode;
    aliveElement: ReactNode;
}

const Cell = (props: CellProps) => <>{props.isAlive ? props.aliveElement : props.deadElement}</>

export default Cell;