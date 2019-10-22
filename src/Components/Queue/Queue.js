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
const Queue = classes => {
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
  }, []);

  const pusherLoad = () => {
    var pusher = new Pusher("a3ef4965765d2b7fea88", {
      cluster: "us3",
      forceTLS: true
    });
    var channel = pusher.subscribe("queue-channel");
    channel.bind("queue-item", function(data) {
      alert(JSON.stringify(data));
      console.log("data: ", data);
      // queueTrack(dispatch, data);
    });
  };

  const playNextTrack = () => {
    console.log("current timer : ", timerId);
    displayCurrentTrack(dispatch, true);
    if (queue.length > 0) {
      if (timerId) clearTimeout(timerId);
      //get device id
      let payload = {
        trackName: queue[0].name,
        trackImage: queue[0].trackImage,
        trackDuration: queue[0].duration
      };
      updateCurrentTrack(dispatch, payload);
      //dispatch currentTrack
      const deviceId = "23ac1242e1b5a0cdf2e744c6ca242964bce8edad";
      console.log("playing track...");
      let duration = queue[0].duration;
      console.log("track duration:", duration);
      timerId = setTimeout(playNextTrack, duration);
      playTrack(queue[0].trackId, deviceId, accessToken);
      queue.splice(0, 1);
      queueTrack(dispatch, queue);
      sendQueuePusher(queue, privateId);
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
