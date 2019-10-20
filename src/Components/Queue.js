import React, { Component, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { queueTrack, updateCurrentTrack } from "../Actions/QueueActions";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { playTrack } from "../Middleware/playbackMiddleware";
import Pusher from "pusher-js";
const Queue = () => {
  const { queue, accessToken } = useSelector(state => ({
    ...state.queueTrackReducer,
    ...state.sessionReducer
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
  };
  const downVoteTrack = e => {
    let trackId = e.target.id;
    setQueueModified(true);
    queue[trackId].score -= 1;
    queue.sort((a, b) => b.score - a.score);
    queueTrack(dispatch, queue);
  };
  const getAllQueueItems = () => {
    let queuedTracks = queue;
    if (queuedTracks) {
      return queuedTracks.map((key, i) => (
        <li key={i}>
          <div>
            <span>{queuedTracks[i].name}</span>
            <button className="btnUpvote" id={i} onClick={upVoteTrack}>
              {/* <ArrowUpwardIcon id={i} onClick={upVoteTrack} /> */}
              Up
            </button>
            <button id={i} onClick={downVoteTrack} className="btnDownvote">
              {/* <ArrowDownwardIcon id={i} onClick={downVoteTrack} /> */}
              Down
            </button>
            <span>Score: {queuedTracks[i].score}</span>
          </div>
        </li>
      ));
    }
  };

  return (
    <div>
      <h1>Queue</h1>
      <ul>{getAllQueueItems()}</ul>
      <button onClick={playNextTrack}>Play Next</button>
    </div>
  );
};
export default Queue;
