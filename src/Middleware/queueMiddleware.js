import authHost from "../config/app";

const BACKEND_URI = authHost.HOST;

export const sendQueuePusher = (queue, privateId, master = "") => {
  fetch(BACKEND_URI + "/update_queue", {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json"
    }),
    body: JSON.stringify({
      master: master,
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
