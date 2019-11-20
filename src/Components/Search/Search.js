/* eslint-disable no-restricted-globals */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import TrackItem from "../ListItem/ListItem";
import { setPrivateID } from "../../Actions/SessionActions";
import SearchBar from "../SearchBar/SearchBar";
import "./Search.css";

const Search = () => {
  const { tracks } = useSelector(state => ({
    ...state.tracksReducer,
    ...state.queueTrackReducer,
    ...state.sessionReducer,
    ...state.privateIdReducer,
    ...state.socketReducer
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    let privateId = window.localStorage.getItem("privateId");
    if (privateId) setPrivateID(dispatch, privateId);
  }, []);

  const getAllTracks = () => {
    let totalTracks = [];
    if (tracks) {
      tracks.map((keyName, i) => {
        let currentTrack = tracks[i];
        if (
          currentTrack.hasOwnProperty("album") &&
          currentTrack.album.hasOwnProperty("images") &&
          currentTrack.album.images.length > 0
        ) {
          let trackItem = (
            <TrackItem
              key={i}
              id={i}
              trackImage={tracks[i].album.images[0].url}
              trackName={tracks[i].name}
            />
          );
          totalTracks.push(trackItem);
        }
      });
      return totalTracks;
    }
  };

  return (
    <div className="search-container">
      <SearchBar />
      {getAllTracks()}
    </div>
  );
};

export default Search;
