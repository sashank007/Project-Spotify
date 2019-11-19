import fetch from "isomorphic-unfetch";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

export const playTrack = (trackId, device_id, token) => {
  console.log(trackId);
  return fetch(`${SPOTIFY_API_BASE}/me/player/play`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      uris: [`${trackId}`]
    })
  });
};
