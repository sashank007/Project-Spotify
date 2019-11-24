import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    width: " 50vw",
    position: "absolute",
    left: " 20%",
    right: "0",
    bottom: "6vh"
  },
  data: {
    float: "left",
    padding: "5px"
  }
}));

export default function Intro() {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" component="h3">
        Spotiq
      </Typography>
      <Typography component="p">
        <ol className={classes.partyInstr}>
          <li className={classes.data}>
            Share your party id with your friends for them to join.
          </li>
          <li className={classes.data}>
            Create a new collaborative queue and hit play when you are ready.
          </li>
          <li className={classes.data}>
            Each party can have only one DJ so choose wisely on who hits play!
          </li>
          <li className={classes.data}>
            Upvote or Downvote your favorite songs. Each vote deducts 1 point.
          </li>
          <li className={classes.data}>
            If any song you added gets played, you get 2 points.
          </li>
        </ol>
      </Typography>
    </Paper>
  );
}
