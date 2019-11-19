import fetch from "isomorphic-unfetch";
import authHost from "../config/app";

const BACKEND_URI = authHost.HOST;
export const updatePoints = (privateId, userId, points) => {
  return fetch(`${BACKEND_URI}/update_user`, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json"
    }),
    body: JSON.stringify({
      userId: userId,
      privateId: privateId,
      points: points
    })
  });
};

export const getUserPoints = (privateId, playerId) => {
  console.log("private Id player id in gup : ", privateId, playerId);
  return fetch(`${BACKEND_URI}/get_user_by_id`, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json"
    }),
    body: JSON.stringify({
      playerId: playerId,
      privateId: privateId
    })
  });
};
