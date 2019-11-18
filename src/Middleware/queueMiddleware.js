import authHost from "../config/app";

const BACKEND_URI = authHost.HOST;
const WEBSOCKET_URI = authHost.SOCKET;
const WEBSOCKET_ACTION_SEND = authHost.ACTION_SEND;
// const BACKEND_URI = "http://localhost:5000"

export const sendQueuePusher = (queue, privateId) => {
  fetch(BACKEND_URI + "/update_queue", {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json"
    }),
    body: JSON.stringify({
      queue: queue,
      privateId: privateId
    })
  })
    .then(res => res.json())
    .then(data => console.log(data));
};

export const getQueue = privateId => {
  return fetch(BACKEND_URI + "/get_queue", {
    method: "post",
    headers: new Headers({
      "content-type": "application/json"
    }),
    body: JSON.stringify({
      privateId: privateId
    })
  });
};
