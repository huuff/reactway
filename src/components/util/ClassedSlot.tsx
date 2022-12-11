import isArray from "lodash/isArray";
import { Children, cloneElement, ReactElement } from "react";

type ClassedSlotProps = {
    children: ReactElement | ReactElement[];
    className: string,
}

function withClassName(element: ReactElement, className: string): ReactElement {
    return cloneElement(
            element,
            { ...element.props, className: `${element.props.className} ${className}`}
        );   
}
const ClassedSlot = ({ children, className }: ClassedSlotProps) => {
    return (
        <>
            {
                isArray(children)
                    ? Children.map(children, (child) => withClassName(child, className))
                    : withClassName(children, className)
            }
        </>
    )
}


export default ClassedSlot;