import React from "react";
import { useSelector } from "react-redux";
import Coin from "../../Assets/coin_img.png";
import Musician from "../../Assets/dj.png";
import Drawer from "@material-ui/core/Drawer";
import { Button } from "@material-ui/core";

import useMediaQuery from "@material-ui/core/useMediaQuery";

import "./AllUsers.css";
export default function AllUsers() {
  const matches = useMediaQuery("(min-width:600px)");

  let { playingUsers } = useSelector(state => ({
    ...state.sessionReducer,
    ...state.privateIdReducer,
    ...state.allUsersReducer
  }));

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  });

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

  const toggleDrawer = (side, open) => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  return (
    <div>
      {matches ? (
        <div className="allusers-container">
          <p className="current-players-heading">CURRENT PLAYERS</p>
          <ul className="users-list">
            <li className="img-item">
              <span>
                <img className="coin" src={Coin} alt="points"></img>
                <img className="coin" src={Musician} alt="musician"></img>
              </span>
            </li>
            <GetAllUsers />
          </ul>
        </div>
      ) : (
        <div>
          <Button
            style={{
              fontSize: 8,
              fontFamily: "'Rajdhani', sans-serif",
              position: "absolute",
              left: 0,
              marginLeft: "12px",
              top: "10vh",
              color: "white"
            }}
            onClick={toggleDrawer("left", true)}
            variant="outlined"
          >
            Scoreboard
          </Button>
          <Drawer
            style={{ width: 250 }}
            anchor="left"
            open={state.left}
            onClose={toggleDrawer("left", false)}
          >
            <p className="current-players-heading">CURRENT PLAYERS</p>
            <ul className="users-list">
              <li className="img-item">
                <span>
                  <img className="coin" src={Coin} alt="points"></img>
                  <img className="coin" src={Musician} alt="musician"></img>
                </span>
              </li>
              <GetAllUsers />
            </ul>
          </Drawer>
        </div>
      )}
    </div>
  );
}
