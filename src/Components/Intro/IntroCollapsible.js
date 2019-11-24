import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export default function IntroCollapsible() {
  const matches = useMediaQuery("(min-width:600px)");

  const useStyles = makeStyles(theme =>
    matches
      ? {
          root: {
            width: "50vw",
            position: "absolute",
            left: " 20%",
            right: "0",
            bottom: "12vh",
            zIndex: "10"
          },
          heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
            fontFamily: "Luckiest Guy"
          },
          data: {
            float: "left",
            fontFamily: "'Roboto Mono', monospace",
            fontSize: "1.5vh",
            padding: "5px"
          }
        }
      : {
          root: {
            width: "65vw",
            position: "absolute",
            left: " 20%",
            right: "0",
            bottom: "12vh",
            zIndex: "10"
          },
          heading: {
            fontSize: "2vh",
            fontWeight: theme.typography.fontWeightRegular,
            fontFamily: "Luckiest Guy"
          },
          data: {
            float: "left",
            fontFamily: "'Roboto Mono', monospace",
            fontSize: "2.5vw",
            padding: "5px"
          }
        }
  );

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Party Rules</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <ol className={classes.partyInstr}>
            <li className={classes.data}>
              Share your party id with your friends for them to join the party.
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
            <li className={classes.data}>Player with the most points wins.</li>
          </ol>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}
