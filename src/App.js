/* eslint-disable no-restricted-globals */
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./store";
import "./App.css";
import MiddleComponent from "./Components/MiddleComponent/MiddleComponent";

function App() {
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

  const onLoad = () => {
    var id = window.localStorage.getItem("privateId");
    let uniqueId = getUniqueId();

    if (!id) {
      window.localStorage.setItem("privateId", uniqueId);

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
