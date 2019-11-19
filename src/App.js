/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "./store";
import "./App.css";
import MiddleComponent from "./Components/MiddleComponent/MiddleComponent";

function App() {
  const [privateId, setPrivateId] = useState();

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
        <MiddleComponent />
      </Provider>
    </div>
  );
}

export default App;
