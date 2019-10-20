export const sendQueuePusher = queue => {
  fetch("/queue", {
    method: "post",
    // mode: "no-cors",
    headers: new Headers({
      "content-type": "application/json"
    }),
    body: JSON.stringify({
      queue: queue
    })
  })
    .then(res => res.json())
    .then(data => console.log(data));
};
