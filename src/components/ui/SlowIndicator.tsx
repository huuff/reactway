import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PerformanceTrackerContext } from "../../hooks/use-performance-tracker";
import { faExclamationCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { useContext, useState } from "react";
import { isEmpty } from "lodash";

type SlowIndicatorProps = {
    resetSettings: () => void;
}

// TODO: Test dismissing
const SlowIndicator = ({ resetSettings }: SlowIndicatorProps) => {
    const tracker = useContext(PerformanceTrackerContext);

    const isSlow = tracker.isSlow || !isEmpty(tracker.disabledFeatures);
    const [ isHidden, setHidden ] = useState(false);

    if (!isSlow) {
        return null;
    }

    if (isHidden) {
        return (
            <div className={classNames(
                "fixed",
                "bottom-5",
                "left-10",
                "text-slate-100",
                "w-50",
                "px-3",
                "py-1",
                "opacity-90",
                "bg-red-500",
                "rounded-full",
                "mb-1",
            )} onClick={() => setHidden(false)}>
                <FontAwesomeIcon icon={faExclamationCircle} className="w-5" /> 
            </div>
        );
    } else {
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
                    "justify-between",
                )}>
                    <div className="flex">
                        <FontAwesomeIcon icon={faExclamationCircle} className="w-5 mr-2" /> 
                        <span>Ticking is slow</span>
                    </div>
                    <button role="close" onClick={() => setHidden(true)}>
                        <FontAwesomeIcon icon={faXmark} className="w-2.5 text-slate-300" />
                    </button>
    
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
    }

};

export default SlowIndicator;