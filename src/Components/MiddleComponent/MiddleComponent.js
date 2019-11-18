import React, { useState, useEffect } from "react";
import Search from "../Search/Search";
import Login from "../Login/Login";
import CurrentTrack from "../CurrentTrack/CurrentTrack";
import Queue from "../Queue/Queue";
import AllUsers from "../AllUsers/AllUsers";
import IDInput from "../IDInput/IDInput";

export default function MiddleComponent() {
  return (
    <div>
      <Search />
      <Login />
      <CurrentTrack />
      <Queue />
      <AllUsers />
      <IDInput />
    </div>
  );
}
