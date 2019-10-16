import React from "react";
import { useSelector } from "react-redux";
import "./CurrentTrack.css";
export default function CurrentTrack(props) {
  const { trackName, trackImage } = useSelector(state => ({
    ...state.currentTrackReducer
  }));
  return (
    <div className="current-track">
      <h3 id="track-name">{trackName}</h3>
      <img id="track-image" src={trackImage} alt="track"></img>
    </div>
  );
}
