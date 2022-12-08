import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react"
import { PerformanceTracker } from "../hooks/use-performance-tracker"
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

const SlowIndicator: FC<{ tracker: PerformanceTracker }> = ({ tracker }) => {
    if (!tracker.isSlow) {
        return null;
    }

    return (<div className={classNames(
        "fixed",
        "bottom-5",
        "left-5",
        "bg-red-500",
        "text-slate-100",
        "rounded-lg",
        "px-3",
        "py-1",
        "w-50",
        "flex",
        "opacity-90",
    )}>
        <FontAwesomeIcon icon={faExclamationCircle} className="w-5 mr-2" /> Ticking is slow
    </div>)
};

export default SlowIndicator;