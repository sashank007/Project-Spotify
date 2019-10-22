import React from "react";
import { useDispatch, useSelector } from "react-redux";

import "./AllUsers.css";
export default function AllUsers() {
  let { playingUsers } = useSelector(state => ({
    ...state.sessionReducer,
    ...state.privateIdReducer,
    ...state.allUsersReducer
  }));

  const getAllUsers = () => {
    return playingUsers.map((i, key) => <li>{playingUsers[key].userName}</li>);
  };

  return (
    <div className="allusers-container">
      <h3>Current Players</h3>
      <ul>{getAllUsers()}</ul>
    </div>
  );
}
