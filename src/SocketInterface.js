import authHost from "./config/app";

class Socket {
  constructor(socketUri) {
    const WEBSOCKET_ACTION_SEND = authHost.ACTION_SEND;
    this.socketUri = socketUri;
    this.socket = new WebSocket(this.socketUri);
    this.socketData = { action: WEBSOCKET_ACTION_SEND };
  }

  createConnection = () => {
    let io = this.socket;
    var self = this;
    io.onopen = function(e) {
      alert("[open] Connection established");
      //   self.sendMessage(`connection established...`);
    };
  };

  sendMessage = data => {
    this.socket.send(
      JSON.stringify({
        ...this.socketData,
        data: data
      })
    );
  };

  onMessageReceived(callback) {
    this.socket.onmessage = function(event) {
      //   alert(`[message] Data received from server: ${event.data}`);
      console.log("event data: ", event.data);
      callback(event.data);
    };
  }

  onCloseSocket(callback) {
    this.socket.onclose = function(event) {
      if (event.wasClean) {
        alert(
          `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
        );
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        alert("[close] Connection died");
      }
    };
  }
}

export default Socket;
