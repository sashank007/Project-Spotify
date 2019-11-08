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
        <li key={i}>
          <div>
            <span>{playingUsers[key].userName}</span>
            <span>{playingUsers[key].points}</span>
          </div>
        </li>
      ));
    }
  };

  return (
    <div className="allusers-container">
      <p>CURRENT PLAYERS</p>
      {/* <ul>{getAllUsers()}</ul> */}
    </div>
  );
}
