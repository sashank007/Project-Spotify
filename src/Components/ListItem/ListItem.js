import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

import { useDispatch, useSelector } from "react-redux";

import { queueTrack } from "../../Actions/QueueActions";
import { sendQueuePusher } from "../../Middleware/queueMiddleware";

const useStyles = makeStyles(theme => ({
  root: {
    width: "70%",
    maxWidth: "70vw",
    marginLeft: "15vw",
    color: "#0000004a",
    display: "block",
    borderRadius: "5px",
    backgroundColor: "#fff",
    border: "0.4px solid black",
    fontFamily: "'PT Sans Narrow', sans-serif"
  },
  inline: {
    display: "inline"
  }
}));

export default function TrackItem(props) {
  const classes = useStyles();
  let { trackName, trackImage, id } = props;

  const dispatch = useDispatch();

  const { tracks, queue, privateId, socket } = useSelector(state => ({
    ...state.tracksReducer,
    ...state.queueTrackReducer,
    ...state.sessionReducer,
    ...state.privateIdReducer,
    ...state.socketReducer
  }));

  const queueTheTrack = e => {
    let currentPlayer = window.localStorage.getItem("currentUserId");
    queue.push({
      name: trackName,
      trackId: tracks[id].uri,
      score: 0,
      duration: tracks[id].duration_ms,
      trackImage: tracks[id].album.images[0].url,
      playedBy: currentPlayer
    });

    //send socket data
    socket.sendMessage(JSON.stringify(queue));

    //queue the new track
    queueTrack(dispatch, queue);

    //update db with current queue
    sendQueuePusher(queue, privateId);
  };

  return (
    <List className={classes.root} onClick={queueTheTrack}>
      <div>
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
      </div>
    </List>
  );
}
