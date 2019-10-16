import React, { Component, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTracks, searchQuery } from "../Actions/SearchActions";
import { searchTracks } from "../Middleware/searchMiddleWare";
import { queueTrack } from "../Actions/QueueActions";
import Queue from "./Queue";
import AlignItemsList from "./ListItem";
import TrackItem from "./ListItem";
import CurrentTrack from "./CurrentTrack";

const Search = () => {
  const { tracks, queue } = useSelector(state => ({
    ...state.tracksReducer,
    ...state.queueTrackReducer
  }));

  const dispatch = useDispatch();
  const searchEl = useRef();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    // if (process.browser) {
    //   const refreshToken = localStorage.getItem("refreshToken");
    //   const accessToken = localStorage.getItem("accessToken");
    //   const expiresIn = localStorage.getItem("expiresIn");
    //   console.log(refreshToken, accessToken, expiresIn);
    // }
  });

  // const onLoad = () =>
  // {

  // }

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
    queue.push({
      name: trackName,
      trackId: tracks[id].uri,
      score: 0,
      duration: tracks[id].duration_ms,
      trackImage: tracks[id].album.images[0].url
    });
    queueTrack(dispatch, queue);
  };

  const getAllTracks = () => {
    if (tracks) {
      console.log("get all tracks :", tracks);
      return tracks.map((keyName, i) => (
        <li key={i} id={i} onClick={queueTheTrack}>
          {tracks[i].name}
        </li>
        // <TrackItem
        //   click={queueTheTrack}
        //   key={i}
        //   trackImage={tracks[i].album.images[0].url}
        //   trackName={tracks[i].name}
        // />
      ));
    }
  };

  return (
    <div className="search-container">
      <input className="SearchBox" ref={searchEl} onChange={onUpdateInput} />
      {getAllTracks()}
      <Queue />
    </div>
  );
};

export default Search;
