/* eslint-disable no-restricted-globals */
import React, { Component, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTracks, searchQuery } from "../../Actions/SearchActions";
import { searchTracks } from "../../Middleware/searchMiddleWare";
import { queueTrack } from "../../Actions/QueueActions";
import Queue from "../Queue/Queue";
import AlignItemsList from "../ListItem/ListItem";
import TrackItem from "../ListItem/ListItem";
import CurrentTrack from "../CurrentTrack/CurrentTrack";
import { sendQueuePusher } from "../../Middleware/queueMiddleware";
import { setPrivateID } from "../../Actions/SessionActions";
import SearchBar from "../SearchBar/SearchBar";
import "./Search.css";

const Search = props => {
  const { tracks, queue, accessToken, privateId, socket } = useSelector(
    state => ({
      ...state.tracksReducer,
      ...state.queueTrackReducer,
      ...state.sessionReducer,
      ...state.privateIdReducer,
      ...state.socketReducer
    })
  );

  const dispatch = useDispatch();

  useEffect(() => {
    // let privateId = getUrlParameter("id");
    // if (privateId) {
    //   setPrivateID(dispatch, privateId);
    // }
    let privateId = window.localStorage.getItem("privateId");
    if (privateId) setPrivateID(dispatch, privateId);
  }, []);
  function getUniqueId() {
    return (
      "public-" +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  }

  // function to get a query param's value
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

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
