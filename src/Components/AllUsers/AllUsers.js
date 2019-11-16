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
    if (playingUsers) {
      console.log("playing users: ", playingUsers);
      return playingUsers.map((i, key) => (
        <li key={i}>
          <div>
            <span>{playingUsers[key].userName}</span>
            <span className="points-container">{playingUsers[key].points}</span>
          </div>
        </li>
      ));
    }
  };

  return (
    <div className="allusers-container">
      <p className="current-players-heading">CURRENT PLAYERS</p>
      <ul className="users-list">{getAllUsers()}</ul>
    </div>
  );
}
