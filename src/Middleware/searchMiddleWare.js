import fetch from "isomorphic-unfetch";

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
        displayAllTracks(res.tracks.items);
        return res.tracks.items;
      }
    });
};

const displayAllTracks = tracks => {
  let allTracks = [];
  for (let i = 0; i < tracks.length; i++) {
    allTracks.push(tracks[i].name);
  }
};
