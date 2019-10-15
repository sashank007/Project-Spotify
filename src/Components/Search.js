import React, { Component, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTracks, searchQuery } from "../Actions/SearchActions";
import { searchTracks } from "../Middleware/searchMiddleWare";

const Search = () => {
  const { tracks } = useSelector(state => ({
    ...state.tracksReducer
  }));

  const dispatch = useDispatch();
  const searchEl = useRef();
  const [searchText, setSearchText] = useState("");

  const onUpdateInput = () => {
    console.log("search element : ", searchEl.current.value);
    setSearchText(searchEl.current.value);
    searchQuery(dispatch, searchText);
    searchTracks(searchText).then(res => {
      setTracks(dispatch, res);
    });
  };

  const getAllTracks = () => {
    {
      if (tracks) {
        console.log("get al tracks :", tracks);
        return tracks.map((keyName, i) => <li>{tracks[i].name}</li>);
      }
    }
  };

  return (
    <div className="search-container">
      Searching:
      <input className="SearchBox" ref={searchEl} onChange={onUpdateInput} />
      <div className="inputElement">{searchText}</div>
      <ul> {getAllTracks()}</ul>
    </div>
  );
};

export default Search;
