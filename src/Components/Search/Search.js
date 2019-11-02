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
import Pusher from "pusher-js";
const Search = props => {
  const { tracks, queue, accessToken, privateId } = useSelector(state => ({
    ...state.tracksReducer,
    ...state.queueTrackReducer,
    ...state.sessionReducer,
    ...state.privateIdReducer
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    onLoad();
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

  const onLoad = () => {
    Pusher.logToConsole = true;
    var pusher = new Pusher("a3ef4965765d2b7fea88", {
      cluster: "us3",
      forceTLS: false
    });
    var channel = pusher.subscribe("queue-channel");
    channel.bind("queue-item", function(data) {
      console.log("pusher added  with private id : ", data);
      // sendQueuePusher(queue);
      // let currentPrivateId = window.localStorage.getItem("privateId");
      // if (data.privateId === currentPrivateId)
      queueTrack(dispatch, data.queue);
      // setQ(data.queue);
    });
  };

  const getAllTracks = () => {
    if (tracks) {
      console.log("get all tracks :", tracks);
      return tracks.map((keyName, i) => (
        <TrackItem
          key={i}
          id={i}
          trackImage={tracks[i].album.images[0].url}
          trackName={tracks[i].name}
        />
      ));
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
