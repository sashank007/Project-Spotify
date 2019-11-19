import React from "react";
import { useSelector } from "react-redux";
import Coin from "../../Assets/coin_img.png";
import Musician from "../../Assets/dj.png";

import "./AllUsers.css";
export default function AllUsers() {
  let { playingUsers } = useSelector(state => ({
    ...state.sessionReducer,
    ...state.privateIdReducer,
    ...state.allUsersReducer
  }));

  const GetAllUsers = () => {
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
      <ul className="users-list">
        <li>
          <span>
            <img className="coin" src={Coin} alt="points"></img>
            <img className="coin" src={Musician} alt="musician"></img>
          </span>
        </li>
        <GetAllUsers />
      </ul>
    </div>
  );
}
