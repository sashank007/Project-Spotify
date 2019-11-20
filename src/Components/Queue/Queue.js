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

import { IsJsonString, isSameParty } from "../../utils";

import UpIcon from "../Common/UpIcon";
import DownIcon from "../Common/DownIcon";

import {
  queueTrack,
  updateCurrentTrack,
  setMaster
} from "../../Actions/QueueActions";
import { setSocket } from "../../Actions/SessionActions";
import { setAllUsers } from "../../Actions/UsersActions";
import { displayCurrentTrack } from "../../Actions/CurrentTrackActions";
import { updatePoints } from "../../Middleware/pointsMiddleware";
import Socket from "../../Interface/SocketInterface";
import authHost from "../../config/app";
import "./Queue.css";

import Player from "../../Interface/PointsInterface";
const SOCKET_URI = authHost.SOCKET;

const Queue = (classes, props) => {
  const {
    queue,
    accessToken,
    privateId,

    isMaster,
    socket
  } = useSelector(state => ({
    ...state.queueTrackReducer,
    ...state.sessionReducer,
    ...state.privateIdReducer,
    ...state.allUsersReducer,
    ...state.masterReducer,
    ...state.socketReducer
  }));

  const matches = useMediaQuery("(min-width:600px)");

  const [timerId, setTimerId] = useState(null);

  const dispatch = useDispatch();

  const addToQueue = data => {
    try {
      //check if current privateId same as queue private Id
      if (IsJsonString(data)) {
        console.log(data);
        let d = JSON.parse(data);
        let id = d.privateId;

        //check if current pusher coming in is of same party
        console.log("id ... ", id);
        if (isSameParty(id)) {
          if (d.hasOwnProperty("master")) {
            //update current master
            let { master } = d;
            window.localStorage.setItem("master", master);
            if (
              master !== "" &&
              master !== window.localStorage.getItem("currentUserId")
            )
              setMaster(dispatch, false);
            else setMaster(dispatch, true);
          } else if (d.hasOwnProperty("currentUsers")) {
            let { currentUsers } = d;
            console.log("currentuserS: ", currentUsers);
            currentUsers.sort((a, b) => b.points - a.points);
            setAllUsers(dispatch, currentUsers);
          } else {
            let { queue } = d;
            console.log("inside q: ", queue);
            queueTrack(dispatch, queue);
          }
        }
      }
    } catch (e) {
      throw e;
    }
  };

  const fetchAllUsers = () => {
    //fetch all users first
    getAllUsers(privateId)
      .then(res => res.json())
      .then(res => {
        initialFetchUsers(res);
      });
  };
  const sendSocketData = e => {
    socket.sendMessage(JSON.stringify({ queue: queue, privateId: privateId }));
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
    fetchAllUsers();
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

  const pointModification = (callback, addPoints, userId, mode = "vote") => {
    let privateId = window.localStorage.getItem("privateId");

    let player = new Player(privateId, userId);
    player
      .getUserPoints()
      .then(res => res.json())
      .then(data => {
        console.log("points data for indiv user: ", data);
        if (data.users.length > 0) {
          let { points } = data.users[0];
          if (mode === "vote" && points <= 0) {
            //do not increase queue
            //send alert saying you don't have enough points
            alert("You do not have enough points");
          } else {
            points = points + addPoints;
            callback(points);

            //update points
            updatePoints(privateId, userId, points)
              .then(res => res.json())
              .then(d => {
                if (d.status === 200) {
                  getAllUsers(privateId)
                    .then(res => res.json())
                    .then(res => {
                      handleUsers(res);
                    });
                  console.log("succesfully updated points...");
                }
              });
          }
        }
      });
  };

  const masterPlayTrack = () => {
    //master has clicked on play track
    //send websocket to all users saying who master is

    playTrack(queue[0].trackId, "", accessToken).then(res => {
      if (res.status === 200 || res.status === 204) {
        let master = window.localStorage.getItem("currentUserId");
        //send to db
        sendQueuePusher(queue, privateId, master);
        //send to websocket
        socket.sendMessage(JSON.stringify({ master: master }));

        console.log("timer id exists: ", timerId);

        //show that you are the dj
        if (timerId !== null) {
          clearTimeout(timerId);
          setTimerId(null);
        }
        playNextTrack();
      } else alert("Please make sure a spotify web player is active");
    });
  };

  const playNextTrack = () => {
    //make master as current user
    console.log("entering play next track (only for the dj)...", timerId);

    //check if queue is not empty
    if (queue.length > 0) {
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

      console.log("new duration for timer: ", duration);
      let timerId = setTimeout(playNextTrack, duration);
      setTimerId(timerId);

      console.log("new timer set: ", timerId);

      //play the track on top of queue
      playTrack(queue[0].trackId, "", accessToken).then(res => {
        if (res.status === 200 || res.status === 204) {
          if (queue[0].hasOwnProperty("playedBy")) {
            let { playedBy } = queue[0];

            //update points by 2
            const trackCallback = points => {
              console.log("track callback: ", points);
            };
            pointModification(trackCallback, 2, playedBy, "playTrack");
          }

          //remove the top track
          queue.splice(0, 1);

          //update current user points

          //display the current track in player
          displayCurrentTrack(dispatch, true);

          //update current queue and to all clients
          updateQueue(queue);
        }
      });

      //fetch all users again
      getAllUsers(privateId)
        .then(res => res.json())
        .then(res => {
          handleUsers(res);
        });
    }
  };

  const initialFetchUsers = (res, name, uid) => {
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

    //send to websocket
    socket.sendMessage(JSON.stringify({ currentUsers: currentUsers }));
  };

  const upVoteTrack = e => {
    e.persist();
    const upVoteCallbak = points => {
      let trackId = e.target.id;

      queue[trackId].score += 1;

      //sort queue based on upvotes
      queue.sort((a, b) => b.score - a.score);

      //update current queue and to all clients
      updateQueue(queue);
    };

    //update current user's points
    let currentUserId = window.localStorage.getItem("currentUserId");
    pointModification(upVoteCallbak, -1, currentUserId);
  };

  const downVoteTrack = e => {
    e.persist();
    const downVoteCallback = points => {
      let trackId = e.target.id;

      queue[trackId].score -= 1;

      //sort queue based on upvotes
      queue.sort((a, b) => b.score - a.score);

      //update current queue and to all clients
      updateQueue(queue);
    };

    //update current user's points
    let currentUserId = window.localStorage.getItem("currentUserId");
    pointModification(downVoteCallback, -1, currentUserId);
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
            disabled={!isMaster}
            variant="contained"
            className={classes.button}
            style={{
              backgroundColor: "#fff",
              fontFamily: "'Luckiest Guy', cursive"
            }}
            onClick={masterPlayTrack}
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
              disabled={!isMaster}
              variant="contained"
              className={classes.button}
              style={{
                backgroundColor: "#fff",
                width: "100px",
                marginLeft: "10%",
                fontFamily: "'Luckiest Guy', cursive"
              }}
              onClick={masterPlayTrack}
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
