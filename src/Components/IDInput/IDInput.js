import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPrivateID } from "../../Actions/SessionActions";
import "./IDInput.css";
export default function IDInput() {
  let { playingUsers, privateId } = useSelector(state => ({
    ...state.sessionReducer,
    ...state.privateIdReducer,
    ...state.allUsersReducer,
    ...state.privateIdReducer
  }));

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
      <label>Join a Session</label>
      <input ref={idInputRef}></input>
      <button onClick={setPrivateId}>GO</button>
    </div>
  );
}
