import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PerformanceTrackerContext } from "../hooks/use-performance-tracker";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { useContext } from "react";

type SlowIndicatorProps = {
    resetSettings: () => void;
}

// TODO: Test
const SlowIndicator = ({ resetSettings }: SlowIndicatorProps) => {
    const tracker = useContext(PerformanceTrackerContext);

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
                {
                    (tracker.disabledFeatures.length) !== 0 && (
                        <div className="mb-2">
                            Some features have been disabled
                            <ul>
                                { tracker.disabledFeatures.map((f) => (
                                    <li key={f.name} className="ml-1">&#8211; {f.description}</li>
                                )) }
                            </ul>
                        </div>
                    )
                }
                <p className="font-bold cursor-pointer" onClick={() => { resetSettings(); tracker.reset(); }}>
                    Click here to restore settings
                </p>
            </div>
        </div>);
};

export default SlowIndicator;