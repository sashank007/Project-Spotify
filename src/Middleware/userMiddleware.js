import authHost from "../config/app";

const BACKEND_URI = authHost.HOST;
// const BACKEND_URI = "http://localhost:5000";
export const addNewUser = (privateId, userName, userId) => {
  fetch(BACKEND_URI + "/new_user", {
    method: "post",
    // mode: "no-cors",
    headers: new Headers({
      "content-type": "application/json"
    }),
    body: JSON.stringify({
      privateId: privateId,
      userName: userName,
      userId: userId
    })
  })
    .then(res => res.json())
    .then(data => console.log(data));
};
