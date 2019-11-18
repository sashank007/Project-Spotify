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
      return playingUsers.map((i, key) => (
        <li className="user-item" key={key}>
          <span>{playingUsers[key].userName}</span>
          <span className="points-container">{playingUsers[key].points}</span>
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
