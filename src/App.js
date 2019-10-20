/* eslint-disable no-restricted-globals */
import React, { useEffect } from "react";
import logo from "./logo.svg";
import Search from "../src/Components/Search";
import { Provider } from "react-redux";
import store from "./store";
import "./App.css";
import CurrentTrack from "./Components/CurrentTrack";
// import Pusher from "pusher-js";
import Login from "./Components/Login/Login";

function App() {
  function getUniqueId() {
    return (
      "public-" +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  }
  useEffect(() => {
    onLoad();
    callBackendAPI();
    // .then(res => console.log("response for login:", res));
  });

  // function to get a query param's value
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  const callBackendAPI = () => {
    // fetch("/login", { mode: "no-cors" });
    // const body = await response.json();
    // if (response.status !== 200) {
    //   throw Error(body.message);
    // }
    // return body;
  };

  const onLoad = () => {
    var id = getUrlParameter("id");
    if (!id) {
      location.search = location.search
        ? "&id=" + getUniqueId()
        : "id=" + getUniqueId();
      return;
    }
  };

  return (
    <div className="App">
      <Provider store={store}>
        <Search />
        <Login />
        <CurrentTrack />
      </Provider>
    </div>
  );
}

export default App;
