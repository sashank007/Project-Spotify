import React from "react";
import { useSelector } from "react-redux";
import "./CurrentTrack.css";
export default function CurrentTrack(props) {
  // const { trackName, trackImage } = useSelector(state => ({
  //   ...state.currentTrackReducer
  // }));

  const { showCurrentTrack, trackName, trackImage } = useSelector(state => ({
    ...state.queueTrackReducer,
    ...state.sessionReducer,
    ...state.displayCurrentTrackReducer,
    ...state.currentTrackReducer
  }));

  // let trackName = "Enekenna Yarum illaye";
  // let trackImage = "https://i.ytimg.com/vi/LwUJR22bGGI/maxresdefault.jpg";
  return (
    <div>
      {showCurrentTrack && trackName !== "" && (
        <div className="current-track">
          <h3 id="track-name">{trackName}</h3>
          <img id="track-image" src={trackImage}></img>
        </div>
      )}
    </div>
  );
}
