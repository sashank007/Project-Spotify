require("dotenv").config();
module.exports = {
  HOST: process.env.REACT_APP_BACKEND_URI,
  SOCKET: process.env.REACT_APP_SOCKET_URI,
  ACTION_SEND: "sendMessage"
};
