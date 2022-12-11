import { faPerson } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";

// TODO: Use the theme!
// TODO: Test it?
const PopulationCounter: FC<{population: number}> = ({population}) => {
    return (
        <div className="fixed -bottom-1 right-10 bg-white rounded-lg py-1 px-3 flex flex-row">
            <FontAwesomeIcon icon={faPerson} className="w-3 mr-2"/>
            <span>{ population }</span>
        </div>
    );
};

export default PopulationCounter;