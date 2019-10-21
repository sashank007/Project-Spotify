require("dotenv").config();

const BACKEND_URI = process.env.BACKEND_URI;
export const sendQueuePusher = (queue, privateId) => {
  fetch(BACKEND_URI + "/queue", {
    method: "post",
    // mode: "no-cors",
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
