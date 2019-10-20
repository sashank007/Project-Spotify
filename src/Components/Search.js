/* eslint-disable no-restricted-globals */
import React, { Component, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTracks, searchQuery } from "../Actions/SearchActions";
import { searchTracks } from "../Middleware/searchMiddleWare";
import { queueTrack } from "../Actions/QueueActions";
import Queue from "./Queue/Queue";
import AlignItemsList from "./ListItem";
import TrackItem from "./ListItem";
import CurrentTrack from "./CurrentTrack";
import { sendQueuePusher } from "../Middleware/queueMiddleware";
import { setPrivateID } from "../Actions/SessionActions";
import SearchBar from "../Components/SearchBar/SearchBar";
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
  const searchEl = useRef();

  useEffect(() => {
    onLoad();
    let privateId = getUrlParameter("id");
    if (privateId) {
      setPrivateID(dispatch, privateId);
    }
    // if (process.browser) {
    //   const refreshToken = localStorage.getItem("refreshToken");
    //   const accessToken = localStorage.getItem("accessToken");
    //   const expiresIn = localStorage.getItem("expiresIn");
    //   console.log(refreshToken, accessToken, expiresIn);
    // }
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
    var pusher = new Pusher("a3ef4965765d2b7fea88", {
      cluster: "us3",
      forceTLS: true
    });
    var channel = pusher.subscribe("queue-channel");
    channel.bind("queue-item", function(data) {
      console.log("data: ", data);
      // sendQueuePusher(queue);
      let currentPrivateId = getUrlParameter("id");
      if (data.privateId === currentPrivateId) queueTrack(dispatch, data.queue);
      // queueTrack(dispatch, data);
    });
  };

  // const onUpdateInput = () => {
  //   console.log("search element : ", searchEl.current.value);

  //   searchQuery(dispatch, searchText);
  //   searchTracks(searchText, accessToken).then(res => {
  //     setTracks(dispatch, res);
  //   });
  // };

  const queueTheTrack = e => {
    // let trackName = e.target.innerHTML;
    // let id = e.target.id;
    // queue.push({
    //   name: trackName,
    //   trackId: tracks[id].uri,
    //   score: 0,
    //   duration: tracks[id].duration_ms,
    //   trackImage: tracks[id].album.images[0].url
    // });
    // sendQueuePusher(queue, privateId);
    // queueTrack(dispatch, queue);
  };

  const getAllTracks = () => {
    if (tracks) {
      console.log("get all tracks :", tracks);
      return tracks.map((keyName, i) => (
        // <li key={i} id={i} onClick={queueTheTrack}>
        //   {tracks[i].name}
        // </li>

        <TrackItem
          key={i}
          id={i}
          click={queueTheTrack}
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
