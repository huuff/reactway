import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react"
import { PerformanceTracker } from "../hooks/use-performance-tracker"
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

const SlowIndicator: FC<{ tracker: PerformanceTracker }> = ({ tracker }) => {
    if (!tracker.isSlow) {
        return null;
    }

    return (
        <div className={classNames(
            "fixed",
            "bottom-5",
            "left-10",
            "text-slate-100",
            "w-50",
        )}>
            <div className={classNames(
                "px-3",
                "py-1",
                "flex",
                "opacity-90",
                "bg-red-500",
                "rounded-lg",
                "text",
                "mb-1",
            )}>
                <FontAwesomeIcon icon={faExclamationCircle} className="w-5 mr-2" /> Ticking is slow
            </div>
            <div className={classNames(
                "px-2",
                "py-1",
                "opacity-90",
                "bg-red-500",
                "rounded-lg",
                "text-xs",
            )}>
                {/*<p className="mb-1">Some features have been disabled</p> */}
                <p className="font-bold">Click here to restore settings</p>
            </div>
        </div>)
};

export default SlowIndicator;