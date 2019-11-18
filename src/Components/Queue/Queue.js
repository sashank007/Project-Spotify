import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import Drawer from "@material-ui/core/Drawer";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { playTrack } from "../../Middleware/playbackMiddleware";
import { sendQueuePusher, getQueue } from "../../Middleware/queueMiddleware";
import {
  updateCurrentUser,
  getAllUsers
} from "../../Middleware/userMiddleware";

import { IsJsonString } from "../../utils";

import UpIcon from "../Common/UpIcon";
import DownIcon from "../Common/DownIcon";

import { queueTrack, updateCurrentTrack } from "../../Actions/QueueActions";
import { setSocket } from "../../Actions/SessionActions";
import { setAllUsers } from "../../Actions/UsersActions";
import { displayCurrentTrack } from "../../Actions/CurrentTrackActions";

import Socket from "../../SocketInterface";
import authHost from "../../config/app";
import "./Queue.css";
const SOCKET_URI = authHost.SOCKET;

const Queue = (classes, props) => {
  const { queue, accessToken, privateId, playingUsers, socket } = useSelector(
    state => ({
      ...state.queueTrackReducer,
      ...state.sessionReducer,
      ...state.privateIdReducer,
      ...state.allUsersReducer,
      ...state.socketReducer
    })
  );

  const matches = useMediaQuery("(min-width:600px)");

  let timerId = null;

  const dispatch = useDispatch();

  const addToQueue = data => {
    try {
      if (IsJsonString(data)) {
        let updatedQueue = JSON.parse(data);
        queueTrack(dispatch, updatedQueue);
      }
    } catch (e) {
      throw e;
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
    createSocketConn();
  }, []);

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  });

  const toggleDrawer = (side, open) => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  const updateQueue = queue => {
    //queue the new track
    queueTrack(dispatch, queue);

    //send to all users on same session
    sendSocketData(queue);

    //update db with current queue
    sendQueuePusher(queue, privateId);
  };
  const playNextTrack = () => {
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

      timerId = setTimeout(playNextTrack, duration);

      //play the current track
      playTrack(queue[0].trackId, "", accessToken)
        .then(res => res.json())
        .then(data => {
          if (data.hasOwnProperty("error"))
            alert("Please open a spotify web player");
          else {
            //remove the top track
            queue.splice(0, 1);

            //display the current track in player
            displayCurrentTrack(dispatch, true);

            //update current queue and to all clients
            updateQueue(queue);
          }
        });

      // updateCurrentUser(
      //   privateId,
      //   "r8ggyba4l1r5gxxrjrubv0y6u",
      //   playingUsers[0].points - 1
      // );

      //fetch all users again
      getAllUsers(privateId)
        .then(res => res.json())
        .then(res => {
          handleUsers(res);
        });
    }
  };

  const handleUsers = (res, name, uid) => {
    let { users } = res;
    let currentUsers = [];
    let userIds = [];
    let points = [];

    users.map((i, key) => {
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

    //sort queue based on upvotes
    queue.sort((a, b) => b.score - a.score);

    //update current queue and to all clients
    updateQueue(queue);
  };

  const downVoteTrack = e => {
    let trackId = e.target.id;

    queue[trackId].score -= 1;
    queue.sort((a, b) => b.score - a.score);

    //update current queue and to all clients
    updateQueue(queue);
  };

  const QueueItems = () => {
    let queuedTracks = queue;
    if (queuedTracks) {
      return queuedTracks.map((key, i) => (
        <li key={i}>
          <div>
            <span>{queuedTracks[i].name}</span>
            <UpIcon id={i} click={upVoteTrack} />
            <DownIcon id={i} click={downVoteTrack} />
            <span className="score">{queuedTracks[i].score}</span>
          </div>
        </li>
      ));
    }
  };

  return (
    <div>
      {matches ? (
        <div className="Queue-Container">
          <p style={{ marginTop: "8vh" }}>YOUR QUEUE</p>
          <ul>
            <QueueItems />
          </ul>
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
      ) : (
        <div>
          <Button
            style={{
              fontSize: 8,
              fontFamily: "'Rajdhani', sans-serif",
              position: "absolute",
              right: 0,
              marginRight: "12px",
              top: "10vh",
              color: "white"
            }}
            onClick={toggleDrawer("right", true)}
            variant="outlined"
          >
            Queue
          </Button>
          <Drawer
            style={{ width: 250 }}
            anchor="right"
            open={state.right}
            onClose={toggleDrawer("right", false)}
          >
            <div style={{ width: 250 }}>
              <p style={{ marginLeft: 20, marginTop: "10vh" }}>YOUR QUEUE</p>
              <ul>
                <QueueItems />
              </ul>
            </div>
            <Button
              variant="contained"
              className={classes.button}
              style={{
                backgroundColor: "#fff",
                width: "100px",
                marginLeft: "10%",
                fontFamily: "'Luckiest Guy', cursive"
              }}
              onClick={playNextTrack}
              startIcon={<PlayArrowIcon />}
            >
              Play
            </Button>
          </Drawer>
        </div>
      )}
    </div>
  );
};
export default Queue;
