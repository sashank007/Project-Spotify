import React from "react";
import Search from "../Search/Search";
import Login from "../Login/Login";
import CurrentTrack from "../CurrentTrack/CurrentTrack";
import Queue from "../Queue/Queue";
import AllUsers from "../AllUsers/AllUsers";
import IDInput from "../IDInput/IDInput";
import ButtonAppBar from "../ButtonAppBar/ButtonAppBar";
import Intro from "../Intro/Intro";
import IntroCollapsible from "../Intro/IntroCollapsible";
export default function MiddleComponent() {
  return (
    <div>
      <IntroCollapsible />
      <Search />
      <Login />
      <CurrentTrack />
      <Queue />
      <AllUsers />
      <IDInput />
    </div>
  );
}
