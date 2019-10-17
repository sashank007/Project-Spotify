/* eslint-disable no-restricted-globals */
import React, { useEffect } from "react";
import logo from "./logo.svg";
import Search from "../src/Components/Search";
import { Provider } from "react-redux";
import store from "./store";
import "./App.css";
import CurrentTrack from "./Components/CurrentTrack";
import Pusher from "pusher-js";
import Login from "./Components/Login/Login";

function App() {
  Pusher.logToConsole = true;

  function getUniqueId() {
    return (
      "public-" +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  }
  useEffect(() => {
    // onLoad();
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

    var pusher = new Pusher("a3ef4965765d2b7fea88", {
      cluster: "us3",
      forceTLS: false
    });

    var channel = pusher.subscribe("my-channel");
    channel.bind("my-event", function(data) {
      alert(JSON.stringify(data));
    });
    channel.bind("client-text-edit", function(html) {
      document.innerHTML = html;
    });

    function triggerChange(e) {
      console.log("trigger change ...");
      channel.trigger("client-text-edit", e.target.innerHTML);
    }

    document.addEventListener("input", triggerChange);
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
