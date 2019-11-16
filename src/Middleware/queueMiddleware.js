import authHost from "../config/app";

const BACKEND_URI = authHost.HOST;
const WEBSOCKET_URI = authHost.SOCKET;
const WEBSOCKET_ACTION_SEND = authHost.ACTION_SEND;
// const BACKEND_URI = "http://localhost:5000"
export const sendQueuePusher = (socket, queue, privateId) => {
  // socket.sendMessage(queue);
  // fetch(BACKEND_URI + "/queue", {
  //   method: "POST",
  //   headers: new Headers({
  //     "content-type": "application/json"
  //   }),
  //   body: JSON.stringify({
  //     queue: queue,
  //     privateId: privateId
  //   })
  // })
  //   .then(res => res.json())
  //   .then(data => console.log(data));
};
