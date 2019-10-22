require("dotenv").config();

const BACKEND_URI =
  "https://flr2cnuhpc.execute-api.us-east-1.amazonaws.com/dev";
// const BACKEND_URI = "http://localhost:5000";
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
