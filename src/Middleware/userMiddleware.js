import authHost from "../config/app";

const BACKEND_URI = authHost.HOST;

export const addNewUser = (privateId, userName, userId, points) => {
  fetch(BACKEND_URI + "/new_user", {
    method: "post",
    headers: new Headers({
      "content-type": "application/json"
    }),
    body: JSON.stringify({
      privateId: privateId,
      userName: userName,
      userId: userId,
      points: points
    })
  })
    .then(res => res.json())
    .then(data => console.log(data));
};

export const getAllUsers = privateId => {
  return fetch(BACKEND_URI + "/get_all_users", {
    method: "post",
    headers: new Headers({
      "content-type": "application/json"
    }),
    body: JSON.stringify({
      privateId: privateId
    })
  });
};

export const updateCurrentUser = (privateId, userId, points) => {
  fetch(BACKEND_URI + "/update_user", {
    method: "post",
    headers: new Headers({
      "content-type": "application/json"
    }),
    body: JSON.stringify({
      privateId: privateId,
      userId: userId,
      points: points
    })
  })
    .then(res => res.json())
    .then(data => console.log(data));
};
