import renderer from "react-test-renderer";
import PlayBar from "./PlayBar";

describe("PlayBar", () => {
 
    test("matches snapshot", () => {
        expect(renderer
            .create(<PlayBar 
                playbackMode="play" 
                setPlayback={jest.fn()}
                historyLength={10}
                historyPosition={5}
                setHistoryPosition={jest.fn()}
                startNewGame={jest.fn()}
                clearGrid={jest.fn()}
            />)
            .toJSON()).toMatchSnapshot();
    });

});