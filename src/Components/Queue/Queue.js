import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import Drawer from "@material-ui/core/Drawer";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { isMasterCheck } from "../../utils";

import {
  playTrack,
  getCurrentTrack
} from "../../Middleware/playbackMiddleware";
import { sendQueuePusher } from "../../Middleware/queueMiddleware";
import { getAllUsers } from "../../Middleware/userMiddleware";

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
import { updatePoints } from "../../Middleware/pointsMiddleware";
import Socket from "../../Interface/SocketInterface";
import authHost from "../../config/app";
import "./Queue.css";

import Player from "../../Interface/PointsInterface";

const SOCKET_URI = authHost.SOCKET;

const Queue = (classes, props) => {
  const { queue, accessToken, privateId, isMaster, socket } = useSelector(
    state => ({
      ...state.queueTrackReducer,
      ...state.sessionReducer,
      ...state.privateIdReducer,
      ...state.allUsersReducer,
      ...state.masterReducer,
      ...state.socketReducer,
      ...state.currentTrackReducer
    })
  );

  const matches = useMediaQuery("(min-width:600px)");

  const dispatch = useDispatch();

  const addToQueue = data => {
    try {
      //check if current privateId same as queue private Id
      if (IsJsonString(data)) {
        let d = JSON.parse(data);
        let privateId = d.privateId;

        //check if current pusher coming in is of same party

        if (isSameParty(privateId)) {
          if (d.hasOwnProperty("master")) {
            //update current master
            let { master } = d;
            window.localStorage.setItem("master", master);
            let user = window.localStorage.getItem("currentUserId");
            if (master !== "" && master !== user) setMaster(dispatch, false);
            else setMaster(dispatch, true);
          } else if (d.hasOwnProperty("currentUsers")) {
            let { currentUsers } = d;

            currentUsers.sort((a, b) => b.points - a.points);
            setAllUsers(dispatch, currentUsers);
          } else if (d.hasOwnProperty("queue")) {
            let { queue } = d;
            console.log("socket sent q: ", queue);
            //set new timer with given elapsed time
            //check if current track duration is not 0
            //if 0 , start a new timer and set new song
            queueTrack(dispatch, queue);

            //current track
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
        if (data.users.length > 0) {
          let { points } = data.users[0];
          if (mode === "vote" && points <= 0) {
            //do not increase queue
            //send alert saying you don't have enough points
            alert("YoQu do not have enough points");
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
                }
              });
          }
        }
      });
  };

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
      savedCallback.current = callback;
    });

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }

      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }, [delay]);
  }

  useInterval(() => {
    if (isMasterCheck() && queue.length > 0) {
      getCurrentTrack(accessToken)
        .then(d => {
          if (d.status === 200) return d.json();
        })
        .then(d => {
          //check if current track is not playing and is also not paused
          //if progress_ms>0 , it means it is still playing
          if (d) {
            let { is_playing } = d;
            let { progress_ms } = d;

            if (!is_playing && progress_ms === 0) playNextTrack();
          }
        });
    }
  }, 5000);

  const masterPlayTrack = () => {
    // debugger;
    //master has clicked on play track
    //send websocket to all users saying who master is

    if (queue.length > 0) {
      playTrack(queue[0].trackId, "", accessToken).then(res => {
        if (res.status === 200 || res.status === 204) {
          let master = window.localStorage.getItem("currentUserId");
          //send to db
          sendQueuePusher(queue, privateId, master);
          //send to websocket
          socket.sendMessage(
            JSON.stringify({ privateId: privateId, master: master })
          );
          //play track
          playNextTrack();
        } else alert("Please make sure a spotify web player is active");
      });
    }
  };

  const playNextTrack = () => {
    //make master as current user
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

          //display the current track in player
          // displayCurrentTrack(dispatch, true);

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
      return null;
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
    socket.sendMessage(
      JSON.stringify({ privateId: privateId, currentUsers: currentUsers })
    );
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
          <p className="queue-header" style={{ marginTop: "8vh" }}>
            YOUR QUEUE
          </p>
          <ul className="queue-items">
            <QueueItems />
          </ul>
          <Button
            disabled={!isMaster}
            variant="contained"
            className={classes.button}
            style={{
              backgroundColor: "#fff",
              fontFamily: "'Luckiest Guy', cursive",
              marginBottom: "20px"
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
              top: "13vh",
              marginBottom: "20px",
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
              <p
                className="queue-header"
                style={{ marginLeft: 20, marginTop: "10vh" }}
              >
                YOUR QUEUE
              </p>
              <ul className="queue-items">
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
