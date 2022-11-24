import { fireEvent, render } from "@testing-library/react";
import PlayBar, { PlayBarProps } from "./PlayBar";

describe("PlayBar", () => {
    const defaultProps: PlayBarProps = {
        playbackMode: "play",
        setPlayback: jest.fn(),
        historyLength: 0,
        historyPosition: 0,
        setHistoryPosition: jest.fn(),
        startNewGame: jest.fn(),
        clearGrid: jest.fn(),
    }

    // Maybe too much code to test 3 lines?
    describe("Playback", () => {
        describe("when playing", () => {
            test("there is a pause button", () => {
                const { getByTitle } = render(<PlayBar {...defaultProps} playbackMode="play"/>);
    
                expect(getByTitle("pause")).toBeInTheDocument();
            });
    
            
            test("there is no play button", () => {
                const { queryByTitle } = render(<PlayBar { ...defaultProps } playbackMode="play" />);
    
                expect(queryByTitle("play")).not.toBeInTheDocument();
            });
            
    
            test("when clicking pause, it pauses", () => {
                const { getByTitle } = render(<PlayBar { ...defaultProps } playbackMode="play" />);
    
                fireEvent(getByTitle("pause"), new MouseEvent("click", { bubbles: true }));
    
                expect(defaultProps.setPlayback).toHaveBeenCalledWith("pause");
            });
        });
    
        describe("when paused", () => {
            test("there is a play button", () => {
                const { getByTitle } = render(<PlayBar {...defaultProps} playbackMode="pause"/>);
    
                expect(getByTitle("play")).toBeInTheDocument();
            });
    
            
            test("there is no pause button", () => {
                const { queryByTitle } = render(<PlayBar { ...defaultProps } playbackMode="pause" />);
    
                expect(queryByTitle("pause")).not.toBeInTheDocument();
            });
            
    
            test("when clicking play, it starts", () => {
                const { getByTitle } = render(<PlayBar { ...defaultProps } playbackMode="pause" />);
    
                fireEvent(getByTitle("play"), new MouseEvent("click", { bubbles: true }));
    
                expect(defaultProps.setPlayback).toHaveBeenCalledWith("play");
            });
        });
    });

});