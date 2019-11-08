import React, { Component, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { queueTrack, updateCurrentTrack } from "../../Actions/QueueActions";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { playTrack } from "../../Middleware/playbackMiddleware";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import IconButton from "@material-ui/core/IconButton";

import Pusher from "pusher-js";
import "./Queue.css";
import { Button } from "@material-ui/core";
import UpIcon from "../Common/UpIcon";
import DownIcon from "../Common/DownIcon";
import Login from "../Login/Login";
import { sendQueuePusher } from "../../Middleware/queueMiddleware";
import { displayCurrentTrack } from "../../Actions/CurrentTrackActions";
const Queue = (classes, props) => {
  const { queue, accessToken, privateId } = useSelector(state => ({
    ...state.queueTrackReducer,
    ...state.sessionReducer,
    ...state.privateIdReducer
  }));

  const [trackSequence, setTrackSequence] = useState([]);
  const [queueModified, setQueueModified] = useState(false);
  let timerId = null;

  useEffect(() => {
    // pusherLoad();

    console.log("updating queue...  ");
  }, [queue]);

  useEffect(() => {
    console.log("got props...", props);
  });

  const playNextTrack = () => {
    console.log("current timer : ", timerId);
    console.log("play next track queue : ", queue);

    //check if queue is not empty
    if (queue.length > 0) {
      if (timerId) clearTimeout(timerId);
      //get device id
      let payload = {
        trackName: queue[0].name,
        trackImage: queue[0].trackImage,
        trackDuration: queue[0].duration
      };
      //update the current track to be top track
      updateCurrentTrack(dispatch, payload);

      //set duration for timer
      let duration = queue[0].duration;
      console.log("track duration:", duration);
      timerId = setTimeout(playNextTrack, duration);

      //play the current track
      playTrack(queue[0].trackId, "", accessToken);

      //remove the top track
      console.log("before removing track: ", queue);
      queue.splice(0, 1);
      console.log("removing track: ", queue);

      //update local queue and client pusher
      queueTrack(dispatch, queue);
      sendQueuePusher(queue, privateId);

      //display the current track in player
      displayCurrentTrack(dispatch, true);
    }
  };

  const dispatch = useDispatch();
  const upVoteTrack = e => {
    console.log("event:", e.target);
    setQueueModified(true);
    let trackId = e.target.id;
    queue[trackId].score += 1;
    queue.sort((a, b) => b.score - a.score);
    queueTrack(dispatch, queue);
    sendQueuePusher(queue, privateId);
  };

  const downVoteTrack = e => {
    let trackId = e.target.id;
    setQueueModified(true);
    queue[trackId].score -= 1;
    queue.sort((a, b) => b.score - a.score);
    queueTrack(dispatch, queue);
    sendQueuePusher(queue, privateId);
  };

  const getAllQueueItems = () => {
    let queuedTracks = queue;
    if (queuedTracks) {
      return queuedTracks.map((key, i) => (
        <li key={i}>
          <div>
            <span>{queuedTracks[i].name}</span>
            <UpIcon id={i} click={upVoteTrack} />
            <DownIcon id={i} click={downVoteTrack} />
            <span>{queuedTracks[i].score}</span>
          </div>
        </li>
      ));
    }
  };

  return (
    <div className="Queue-Container">
      <p>YOUR QUEUE</p>
      <ul>{getAllQueueItems()}</ul>
      <Button
        variant="contained"
        className={classes.button}
        style={{
          backgroundColor: "#fff",
          fontFamily: "'Luckiest Guy', cursive"
        }}
        onClick={playNextTrack}
        startIcon={<PlayArrowIcon />}
      >
        Play
      </Button>
    </div>
  );
};
export default Queue;
