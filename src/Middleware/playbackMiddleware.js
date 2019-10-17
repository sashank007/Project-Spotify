import fetch from "isomorphic-unfetch";

import { setTracks } from "../Actions/SearchActions";
import { OAUTH_TOKEN } from "../config/auth";
import { useDispatch, useSelector } from "react-redux";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

export const playTrack = (trackId, device_id) => {
  console.log(trackId);
  fetch(`${SPOTIFY_API_BASE}/me/player/play`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${OAUTH_TOKEN}`
    },
    body: JSON.stringify({
      uris: [`${trackId}`]
    })
  }).then(res => {
    console.log("playback response: ", res);
  });
};
