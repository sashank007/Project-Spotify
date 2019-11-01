import authHost from "../config/app";

const BACKEND_URI = authHost.HOST;
// const BACKEND_URI = "http://localhost:5000";
export const sendQueuePusher = (queue, privateId) => {
  fetch(BACKEND_URI + "/queue", {
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
