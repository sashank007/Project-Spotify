const express = require("express");
const bodyparser = require("body-parser");
const router = express.Router();
var Pusher = require("pusher");

router.post("/", (req, res) => {
  var channels_client = new Pusher({
    appId: "882030",
    key: "a3ef4965765d2b7fea88",
    secret: "f97e508d15786c2958bd",
    cluster: "us3",
    encrypted: false
  });

  console.log(req.body);
  channels_client.trigger("queue-channel", "queue-item", {
    queue: req.body.queue,
    privateId: req.body.privateId
  });
  return res.json({ success: true, message: "Added item to queue" });
});
module.exports = router;
