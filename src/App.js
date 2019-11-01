/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import logo from "./logo.svg";
import Search from "./Components/Search/Search";
import { Provider } from "react-redux";
import store from "./store";
import "./App.css";
import CurrentTrack from "./Components/CurrentTrack/CurrentTrack";
import Pusher from "pusher-js";
import Login from "./Components/Login/Login";
import Queue from "./Components/Queue/Queue";
import IDInput from "./Components/IDInput/IDInput";
import AllUsers from "./Components/AllUsers/AllUsers";

function App() {
  const [privateId, setPrivateId] = useState();
  const [q, setQ] = useState({});
  function getUniqueId() {
    return (
      "public-" +
      Math.random()
        .toString(36)
        .substr(2, 4)
    );
  }

  useEffect(() => {
    onLoad();
    // callBackendAPI();
    // .then(res => console.log("response for login:", res));
  }, []);

  // function to get a query param's value
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  const onLoad = () => {
    var id = window.localStorage.getItem("privateId");
    let uniqueId = getUniqueId();

    var pusher = new Pusher("a3ef4965765d2b7fea88", {
      cluster: "us3",
      forceTLS: false
    });

    var channel = pusher.subscribe("queue-channel");
    channel.bind("queue-item", function(data) {
      console.log("pusher added  with private id : ", data);
      // sendQueuePusher(queue);
      // let currentPrivateId = window.localStorage.getItem("privateId");
      // if (data.privateId === currentPrivateId)
      // queueTrack(dispatch, data.queue);
      setQ(data.queue);
      // queueTrack(dispatch, data);
    });

    if (!id) {
      window.localStorage.setItem("privateId", uniqueId);
      console.log("setting new uniqueid ...");
      // location.search = location.search ? "&id=" + uniqueId : "id=" + uniqueId;
      window.history.pushState({}, document.title, "/?id=" + uniqueId);
      return;
    } else {
      window.history.pushState({}, document.title, "/?id=" + id);
      return;
    }
  };

  return (
    <div className="App">
      <Provider store={store}>
        <Search />
        <Login />
        <CurrentTrack />
        <Queue q={q} />
        <AllUsers />
        <IDInput />
      </Provider>
    </div>
  );
}

export default App;
