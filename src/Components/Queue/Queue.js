import React, { Component, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { queueTrack, updateCurrentTrack } from "../../Actions/QueueActions";
import { setSocket } from "../../Actions/SessionActions";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { playTrack } from "../../Middleware/playbackMiddleware";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import IconButton from "@material-ui/core/IconButton";

import {
  updateCurrentUser,
  getAllUsers
} from "../../Middleware/userMiddleware";

import Pusher from "pusher-js";
import "./Queue.css";
import { setAllUsers } from "../../Actions/UsersActions";
import { Button } from "@material-ui/core";
import UpIcon from "../Common/UpIcon";
import DownIcon from "../Common/DownIcon";
import Login from "../Login/Login";
import { sendQueuePusher } from "../../Middleware/queueMiddleware";
import { displayCurrentTrack } from "../../Actions/CurrentTrackActions";

import Socket from "../../SocketInterface";
import authHost from "../../config/app";

const SOCKET_URI = authHost.SOCKET;

const Queue = (classes, props) => {
  console.log("queue props: ", props);

  const { queue, accessToken, privateId, playingUsers, socket } = useSelector(
    state => ({
      ...state.queueTrackReducer,
      ...state.sessionReducer,
      ...state.privateIdReducer,
      ...state.allUsersReducer,
      ...state.socketReducer
    })
  );

  let timerId = null;

  const dispatch = useDispatch();

  const addToQueue = data => {
    console.log("new data received: ", data);

    try {
      let updatedQueue = JSON.parse(data);
      queueTrack(dispatch, updatedQueue);
    } catch (e) {
      console.log("parsed data and failed : ", data);
    }
  };

  const sendSocketData = e => {
    socket.sendMessage(JSON.stringify(queue));
  };
  const createSocketConn = () => {
    let s = new Socket(SOCKET_URI);
    setSocket(dispatch, s);

    s.createConnection();

    //listen to new messages
    s.onMessageReceived(addToQueue);
  };

  useEffect(() => {
    console.log("re rendering...");
    createSocketConn();
  }, []);

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

      //reduce user points
      console.log("playing users: ", playingUsers);

      updateCurrentUser(
        privateId,
        "r8ggyba4l1r5gxxrjrubv0y6u",
        playingUsers[0].points - 1
      );

      //fetch all users again
      getAllUsers(privateId)
        .then(res => res.json())
        .then(res => {
          handleUsers(res);
        });

      //remove the top track
      console.log("before removing track: ", queue);
      queue.splice(0, 1);
      console.log("removing track: ", queue);

      //update local queue and client pusher
      queueTrack(dispatch, queue);

      //update to all users
      sendSocketData(queue);

      //display the current track in player
      displayCurrentTrack(dispatch, true);
    }
  };

  const handleUsers = (res, name, uid) => {
    console.log(res);
    let { users } = res;
    let currentUsers = [];
    let userIds = [];
    let points = [];

    users.map((i, key) => {
      console.log(users[key]);
      userIds.push(users[key].userId);
      points.push(users[key].points);
      currentUsers.push({
        userName: users[key].userName,
        userId: users[key].userId,
        points: users[key].points
      });
    });
    setAllUsers(dispatch, currentUsers);
  };

  const upVoteTrack = e => {
    let trackId = e.target.id;
    queue[trackId].score += 1;
    queue.sort((a, b) => b.score - a.score);
    queueTrack(dispatch, queue);

    sendSocketData(queue);
  };

  const downVoteTrack = e => {
    let trackId = e.target.id;

    queue[trackId].score -= 1;
    queue.sort((a, b) => b.score - a.score);

    //queue the new track
    queueTrack(dispatch, queue);

    //send to all users on same session
    sendSocketData(queue);
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
