/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import queryString from "query-string";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { setAllUsers } from "../../Actions/UsersActions";
import { setSessionToken, setPrivateID } from "../../Actions/SessionActions";
import { queueTrack } from "../../Actions/QueueActions";

import { addNewUser, getAllUsers } from "../../Middleware/userMiddleware";
import { getQueue } from "../../Middleware/queueMiddleware";

import "./Login.css";
import authHost from "../../config/app";

const BACKEND_URI = authHost.HOST;

export default function Login() {
  const spotifyLogin = () => {
    window.location = BACKEND_URI + "/login";
  };
  let { accessToken } = useSelector(state => ({
    ...state.sessionReducer,
    ...state.privateIdReducer
  }));

  const matches = useMediaQuery("(min-width:600px)");

  const [userName, setUserName] = useState("");
  const [privateId, setPrivateId] = useState("");

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

    users.map((i, key) => {
      userIds.push(users[key].userId);
      points.push(users[key].points);
      currentUsers.push({
        userName: users[key].userName,
        userId: users[key].userId,
        points: users[key].points
      });
    });

    if (userIds.indexOf(uid) < 0) {
      addTheNewUser(name, uid);
      currentUsers.push({ userName: name });
    }
    setAllUsers(dispatch, currentUsers);
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

  const hasLoggedIn = (userName, userId) => {
    let id = window.localStorage.getItem("privateId");
    setPrivateId(id);
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
          queueTrack(dispatch, queue);
        }
      });
  };

  useEffect(() => {
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
        <div> {userName}</div>
      )}
    </div>
  );
}
