import React from "react";
import logo from "./logo.svg";
import Search from "../src/Components/Search";
import { Provider } from "react-redux";
import store from "./store";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Search />
      </Provider>
    </div>
  );
}

export default App;
