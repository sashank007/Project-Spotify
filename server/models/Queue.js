const express = require("express");
const bodyparser = require("body-parser");
const router = express.Router();
var Pusher = require("pusher");
// const Pusher = require("pusher-lambda-promise");

var pusher = new Pusher({
  appId: "882030",
  key: "a3ef4965765d2b7fea88",
  secret: "f97e508d15786c2958bd",
  cluster: "us3",
  encrypted: false
});

router.post("/", (req, res) => {
  const asyncTrigger = msg => {
    return new Promise((resolve, reject) => {
      pusher.trigger("queue-channel", "queue-item", msg, (err, req, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  };

  const pushNotification = async msg => {
    return await asyncTrigger(msg);
  };

  pushNotification({ queue: req.body.queue, privateId: req.body.privateId });
  // channels_client.trigger("queue-channel", "queue-item", {
  //   queue: req.body.queue,
  //   privateId: req.body.privateId
  // });
  return res.json({ success: true, message: "Added item to queue" });
});
module.exports = router;
