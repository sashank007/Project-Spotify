/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import Search from "../src/Components/Search";
import { Provider } from "react-redux";
import store from "./store";
import "./App.css";
import CurrentTrack from "./Components/CurrentTrack";
// import Pusher from "pusher-js";
import Login from "./Components/Login/Login";
import Queue from "./Components/Queue/Queue";

function App() {
  const [privateId, setPrivateId] = useState();
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
    // callBackendAPI();
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

  const onLoad = () => {
    var id = getUrlParameter("id");
    let uniqueId = getUniqueId();

    if (!id) {
      setPrivateId(uniqueId);
      location.search = location.search ? "&id=" + uniqueId : "id=" + uniqueId;
      return;
    }
  };

  return (
    <div className="App">
      <Provider store={store}>
        <Search />

        {/* <CurrentTrack /> */}
        <Queue />
      </Provider>
    </div>
  );
}

export default App;
