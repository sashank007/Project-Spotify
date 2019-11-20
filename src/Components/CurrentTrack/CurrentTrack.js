import React from "react";
import { useSelector } from "react-redux";
import "./CurrentTrack.css";
export default function CurrentTrack(props) {
  const { showCurrentTrack, trackName, trackImage } = useSelector(state => ({
    ...state.queueTrackReducer,
    ...state.sessionReducer,
    ...state.displayCurrentTrackReducer,
    ...state.currentTrackReducer
  }));

  return (
    <div>
      {showCurrentTrack && trackName !== "" && (
        <div className="current-track">
          <h3 id="track-name">{trackName}</h3>
          <img id="track-image" src={trackImage} alt="track" />
        </div>
      )}
    </div>
  );
}
