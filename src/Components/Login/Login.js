import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import queryString from "query-string";
import { setSessionToken } from "../../Actions/SessionActions";
import authHost from "../../config/app";
import { addNewUser } from "../../Middleware/userMiddleware";
import "./Login.css";

const BACKEND_URI = authHost.HOST;
// const BACKEND_URI = "http://localhost:5000";
console.log("setting backend uri : ", BACKEND_URI);

export default function Login() {
  const spotifyLogin = () => {
    window.location = BACKEND_URI + "/login";
  };
  let { accessToken, privateId } = useSelector(state => ({
    ...state.sessionReducer,
    ...state.privateIdReducer
  }));

  const [userName, setUserName] = useState("");

  const dispatch = useDispatch();

  const callMe = token => {
    console.log("access token: ", token);
    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(response => response.json())
      .then(data => {
        console.log("me data : ", data);
        setUserName(data.display_name);
        addNewUser(privateId, data.display_name, data.id);
      });
  };

  useEffect(() => {
    let parsed = queryString.parse(window.location.search);
    let token = parsed.access_token;
    let expiration = parsed.expr;
    let dateExpiration = new Date().getTime() + expiration * 1000;
    let [localStorageToken, localStorageExpiration] = fetchLocalStorage();
    console.log("token: ", token);
    let expDate = new Date(parseInt(localStorageExpiration));
    let currentDate = new Date();

    if (!token && !localStorageToken) return;
    if (localStorageToken && expDate > currentDate) {
      setSessionToken(dispatch, localStorageToken);
      callMe(localStorageToken);
    } else {
      setSessionToken(dispatch, token);
      callMe(token);
      window.localStorage.setItem("access_token", token);
      window.localStorage.setItem("expiration", dateExpiration);
    }

    window.history.pushState({}, document.title, "/");
  }, []);

  const fetchLocalStorage = () => {
    let token = window.localStorage.getItem("access_token");
    let expr = window.localStorage.getItem("expiration");
    return [token, expr];
  };

  return (
    <div className="Login-Container">
      {accessToken === "" ? (
        <Button
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            marginTop: "5px"
          }}
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
