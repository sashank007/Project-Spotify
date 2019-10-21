import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

import { useDispatch, useSelector } from "react-redux";
import { setTracks, searchQuery } from "../../Actions/SearchActions";
import { searchTracks } from "../../Middleware/searchMiddleWare";
import { queueTrack } from "../../Actions/QueueActions";
import AlignItemsList from "./ListItem";
import CurrentTrack from "../CurrentTrack/CurrentTrack";
import { sendQueuePusher } from "../../Middleware/queueMiddleware";
import { setPrivateID } from "../../Actions/SessionActions";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: "100vw",
    marginLeft: "5vw",
    color: "#0000004a",
    display: "block",
    borderRadius: "5px",
    backgroundColor: "#fff",
    border: "0.4px solid white",
    fontFamily: "'PT Sans Narrow', sans-serif"
  },
  inline: {
    display: "inline"
  }
}));

export default function TrackItem(props) {
  const classes = useStyles();
  let { trackName, trackImage, click, id } = props;

  const dispatch = useDispatch();

  const { tracks, queue, accessToken, privateId } = useSelector(state => ({
    ...state.tracksReducer,
    ...state.queueTrackReducer,
    ...state.sessionReducer,
    ...state.privateIdReducer
  }));

  const queueTheTrack = e => {
    console.log("queue the track:", e);
    queue.push({
      name: trackName,
      trackId: tracks[id].uri,
      score: 0,
      duration: tracks[id].duration_ms,
      trackImage: tracks[id].album.images[0].url
    });
    sendQueuePusher(queue, privateId);
    queueTrack(dispatch, queue);
  };

  return (
    <List className={classes.root} onClick={queueTheTrack}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={trackImage} />
        </ListItemAvatar>
        <ListItemText
          primary={trackName}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              ></Typography>
            </React.Fragment>
          }
        />
      </ListItem>
      {/* <Divider variant="inset" component="li" /> */}
    </List>
  );
}
