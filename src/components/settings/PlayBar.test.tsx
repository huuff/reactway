import renderer from "react-test-renderer";
import PlayBar from "./PlayBar";

jest.spyOn(global.Math, 'random').mockImplementation(() => 0);

describe("PlayBar", () => {
 
    test("matches snapshot", () => {
        expect(renderer
            .create(<PlayBar 
                playback={{ isPlaying: true, start: jest.fn(), pause: jest.fn() }}
                historyLength={10}
                historyPosition={5}
                setHistoryPosition={jest.fn()}
                startNewGame={jest.fn()}
                clearGrid={jest.fn()}
            />)
            .toJSON()).toMatchSnapshot();
    });

});