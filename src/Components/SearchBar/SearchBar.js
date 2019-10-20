import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import DirectionsIcon from "@material-ui/icons/Directions";

import { searchTracks } from "../../Middleware/searchMiddleWare";
import { setTracks, searchQuery } from "../../Actions/SearchActions";

const useStyles = makeStyles(theme => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 800,
    marginLeft: "10px",
    marginTop: "5px"
  },
  input: {
    marginLeft: theme.spacing(1),
    fontFamily: "sans-serif",
    color: "#b3b3b3",
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  }
}));

export default function SearchBar(props) {
  const { tracks, queue, accessToken, privateId } = useSelector(state => ({
    ...state.tracksReducer,
    ...state.queueTrackReducer,
    ...state.sessionReducer,
    ...state.privateIdReducer
  }));

  const classes = useStyles();
  const searchEl = useRef();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");

  const onChangeInput = e => {
    console.log("search element : ", e.target);
    setSearchText(e.target.value);
    searchQuery(dispatch, searchText);
    searchTracks(searchText, accessToken).then(res => {
      setTracks(dispatch, res);
    });
  };

  return (
    <Paper className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Search for Artists, Songs or Albums"
        onChange={onChangeInput}
        ref={searchEl}
        inputProps={{ "aria-label": "search google maps" }}
      />
      <IconButton className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Divider className={classes.divider} orientation="vertical" />
    </Paper>
  );
}