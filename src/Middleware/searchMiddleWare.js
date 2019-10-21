import fetch from "isomorphic-unfetch";
import { setTracks } from "../Actions/SearchActions";
import { useDispatch, useSelector } from "react-redux";
// import { SEARCH_TRACKS } from "../constants/ActionTypes";
// import { searchTracksSuccess } from "../actions/searchActions";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

export const searchTracks = (query, token) => {
  let shouldAddWildcard = false;
  if (query.length > 1) {
    const words = query.split(" ");
    const lastWord = words[words.length - 1];
    if (
      /^[a-z0-9\s]+$/i.test(lastWord) &&
      query.lastIndexOf("*") !== query.length - 1
    ) {
      shouldAddWildcard = true;
    }
  }

  const wildcardQuery = `${query}${shouldAddWildcard ? "*" : ""}`; // Trick to improve search results
  console.log("inside search tracks query : ", wildcardQuery);
  return fetch(
    `${SPOTIFY_API_BASE}/search?q=${encodeURIComponent(
      wildcardQuery
    )}&type=track&
  limit=10`,
    {
      headers: {
        Authorization: "Bearer " + token
      }
    }
  )
    .then(res => res.json())
    .then(res => {
      if (res.hasOwnProperty("tracks")) {
        console.log("result in searchTracks: ", res.tracks.items);
        displayAllTracks(res.tracks.items);
        return res.tracks.items;
      }
    });
};

const displayAllTracks = tracks => {
  let allTracks = [];
  for (let i = 0; i < tracks.length; i++) {
    console.log("each track name :", tracks[i].name);
    allTracks.push(tracks[i].name);
  }
};
