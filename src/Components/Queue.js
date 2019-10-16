import React, { Component, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { queueTrack } from "../Actions/QueueActions";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { playTrack } from "../Middleware/playbackMiddleware";
const Queue = () => {
  const { queue } = useSelector(state => ({
    ...state.queueTrackReducer
  }));

  const [trackSequence, setTrackSequence] = useState([]);
  const [queueModified, setQueueModified] = useState(false);

  const playNextTrack = () => {
    if (queue.length > 0) {
      //get device id
      const deviceId = "23ac1242e1b5a0cdf2e744c6ca242964bce8edad";
      //play the song
      //   for (let i = 0; i < queue.length; i++) {
      //     setTrackSequence(trackSequence.push(queue[i].trackId));
      //   }
      console.log("playing track...");
      playTrack(queue[0].trackId, deviceId);
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
      <button onClick={playNextTrack}>Play</button>
    </div>
  );
};
export default Queue;
