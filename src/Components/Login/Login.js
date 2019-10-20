import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import queryString from "query-string";
import { setSessionToken } from "../../Actions/SessionActions";
import "./Login.css";
export default function Login() {
  const spotifyLogin = () => {
    window.location = "http://localhost:5000/login";
    // fetch("/login", { mode: "no-cors" }).then(res => {
    //   console.log("resp : ", res);
    //   let uri = res.url;
    //   let accessToken = uri.split("=")[1];
    //   console.log("access token:", accessToken);
    //   setSessionToken(dispatch, accessToken);
    //   callMe();
    // });
  };
  let { accessToken } = useSelector(state => ({
    ...state.sessionReducer
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
      });
  };

  useEffect(() => {
    let parsed = queryString.parse(window.location.search);
    let token = parsed.access_token;
    if (!token) return;
    setSessionToken(dispatch, token);

    callMe(token);
  }, []);

  return (
    <div className="Login-Container">
      {accessToken === "" ? (
        <Button onClick={spotifyLogin}>Login</Button>
      ) : (
        <div> {userName}</div>
      )}
    </div>
  );
}
