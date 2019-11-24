/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import queryString from "query-string";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { setAllUsers } from "../../Actions/UsersActions";
import { setSessionToken, setSocket } from "../../Actions/SessionActions";
import { queueTrack, setMaster } from "../../Actions/QueueActions";

import { addNewUser, getAllUsers } from "../../Middleware/userMiddleware";
import { getQueue } from "../../Middleware/queueMiddleware";

import Socket from "../../Interface/SocketInterface";
import "./Login.css";
import authHost from "../../config/app";
import { isMasterCheck, IsJsonString } from "../../utils";

const BACKEND_URI = authHost.HOST;

const SOCKET_URI = authHost.SOCKET;

let sock = null;

export default function Login() {
  const spotifyLogin = () => {
    window.location = BACKEND_URI + "/login";
  };
  let { accessToken, socket, privateId, playingUsers } = useSelector(state => ({
    ...state.sessionReducer,
    ...state.privateIdReducer,
    ...state.socketReducer
  }));

  const matches = useMediaQuery("(min-width:600px)");

  const [userName, setUserName] = useState("");

  const dispatch = useDispatch();

  const callMe = token => {
    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(response => response.json())
      .then(data => {
        setUserName(data.display_name);
        hasLoggedIn(data.display_name, data.id);
      });
  };

  const handleUsers = (res, name, uid) => {
    let { users } = res;
    let currentUsers = [];
    let userIds = [];
    let points = [];
    if (users) {
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
    }

    if (userIds.indexOf(uid) < 0) {
      addTheNewUser(name, uid);
      currentUsers.push({ userName: name, points: 10 });
    }
    console.log("logged in new user: ", currentUsers);
    setAllUsers(dispatch, currentUsers);

    // sock.sendMessage({ privateId: privateId, currentUsers: currentUsers });
  };

  const checkLocalStorage = () => {
    let [localStorageToken, localStorageExpiration] = fetchLocalStorage();
    let expDate = new Date(parseInt(localStorageExpiration));

    let currentDate = new Date();
    if (localStorageToken && expDate > currentDate) {
      setSessionToken(dispatch, localStorageToken);
      callMe(localStorageToken);
      return;
    }
  };

  const checkUrl = () => {
    let parsed = queryString.parse(window.location.search);
    let token = parsed.access_token;
    let expiration = parsed.expr;
    let dateExpiration = new Date().getTime() + expiration * 1000;
    if (token) {
      window.localStorage.setItem("access_token", token);
      window.localStorage.setItem("expiration", dateExpiration);

      setSessionToken(dispatch, token);
      callMe(token);
      window.history.pushState({}, document.title, "/");
    }
  };
  const createSocketConn = () => {
    let s = new Socket(SOCKET_URI);
    // setSocket(dispatch, s);

    s.createConnection();
    console.log("created socket conn in login...");

    s.onMessageReceived(addToQueue);

    //listen to new messages
    setSocket(dispatch, s);
    sock = s;
  };

  const addToQueue = data => {
    try {
      if (IsJsonString(data)) {
        let d = JSON.parse(data);
        let privateId = d.privateId;

        console.log("data from socket login: ", data);
      }
    } catch (e) {
      throw e;
    }
  };

  const hasLoggedIn = (userName, userId) => {
    let id = window.localStorage.getItem("privateId");
    window.localStorage.setItem("currentUserId", userId);

    getAllUsers(id)
      .then(res => res.json())
      .then(res => {
        handleUsers(res, userName, userId);
      });

    //get queue if already existing with privateID
    getQueue(id)
      .then(res => res.json())
      .then(data => {
        if (data.hasOwnProperty("queues") && data.queues.length > 0) {
          let { queue } = data.queues[0];
          //fetch current master, add to localstorage
          let { master } = data.queues[0];
          window.localStorage.setItem("master", master);
          if (isMasterCheck()) setMaster(dispatch, true);
          else setMaster(dispatch, false);

          //queue existing track
          queueTrack(dispatch, queue);
        }
      });
  };

  useEffect(() => {
    // createSocketConn();
    checkLocalStorage();
    checkUrl();
  }, []);

  const fetchLocalStorage = () => {
    let token = window.localStorage.getItem("access_token");
    let expr = window.localStorage.getItem("expiration");
    return [token, expr];
  };

  function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  const addTheNewUser = (name, privateId) => {
    var id = getUrlParameter("id");
    addNewUser(id, name, privateId, 10);
  };

  return (
    <div className="Login-Container">
      {accessToken === "" ? (
        <Button
          style={
            matches
              ? {
                  fontFamily: "'Rajdhani', sans-serif",
                  marginTop: "5px",
                  color: "black"
                }
              : {
                  fontFamily: "'Rajdhani', sans-serif",
                  marginTop: "5px",
                  color: "white"
                }
          }
          onClick={spotifyLogin}
          component="span"
          variant="outlined"
        >
          LOGIN
        </Button>
      ) : (
        <div className="username"> {userName}</div>
      )}
    </div>
  );
}
