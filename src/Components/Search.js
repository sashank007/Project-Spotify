import React, { Component, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTracks, searchQuery } from "../Actions/SearchActions";
import { searchTracks } from "../Middleware/searchMiddleWare";
import { queueTrack } from "../Actions/QueueActions";
import Queue from "./Queue";
const Search = () => {
  const { tracks, queue } = useSelector(state => ({
    ...state.tracksReducer,
    ...state.queueTrackReducer
  }));

  const dispatch = useDispatch();
  const searchEl = useRef();
  const [searchText, setSearchText] = useState("");

  const onUpdateInput = () => {
    console.log("search element : ", searchEl.current.value);
    setSearchText(searchEl.current.value);
    searchQuery(dispatch, searchText);
    searchTracks(searchText).then(res => {
      setTracks(dispatch, res);
    });
  };

  const queueTheTrack = e => {
    console.log("queue the track:", e.target.id);
    let trackName = e.target.innerHTML;
    let id = e.target.id;
    queue.push({ name: trackName, trackId: tracks[id].uri, score: 0 });
    queueTrack(dispatch, queue);
  };
  const getAllTracks = () => {
    if (tracks) {
      console.log("get all tracks :", tracks);
      return tracks.map((keyName, i) => (
        <li key={i} id={i} onClick={queueTheTrack}>
          {tracks[i].name}
        </li>
      ));
    }
  };

  return (
    <div className="search-container">
      Searching:
      <input className="SearchBox" ref={searchEl} onChange={onUpdateInput} />
      <div className="inputElement">{searchText}</div>
      <ul> {getAllTracks()}</ul>
      <Queue />
    </div>
  );
};

export default Search;
