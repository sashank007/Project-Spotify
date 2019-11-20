import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { setPrivateID } from "../../Actions/SessionActions";
import "./IDInput.css";
import { Button } from "@material-ui/core";
export default function IDInput() {
  const idInputRef = useRef();
  const dispatch = useDispatch();
  const setPrivateId = () => {
    let id = "public-" + idInputRef.current.value;
    window.localStorage.setItem("privateId", id);
    setPrivateID(dispatch, id);
    window.location = (document.title, "/?id=" + id);
  };

  return (
    <div className="idinput-container">
      <label className="text-session">Join a Session</label>
      <input className="inp" ref={idInputRef}></input>
      <Button
        variant="contained"
        size="small"
        style={{
          background: "white",
          marginLeft: 2,
          fontFamily: "'Rajdhani', sans-serif"
        }}
        onClick={setPrivateId}
      >
        GO
      </Button>
    </div>
  );
}
