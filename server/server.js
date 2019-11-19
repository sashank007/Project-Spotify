const path = require("path");
const bodyParser = require("body-parser");
let request = require("request");
const querystring = require("querystring");
const AppConfig = require("../src/config/app");
const AuthConfig = require("../src/config/auth");
const redirect_uri = `${AppConfig.HOST}/callback`;
const client_id = AuthConfig.CLIENT_ID;
const client_secret = AuthConfig.CLIENT_SECRET;
const MongoClient = require("mongodb").MongoClient;

const Queue = require("./models/Queue");

const mongoUser = "sas";
const mongoDbName = "Spotiq";
const mongoPass = "sashank007";
const mongoConnStr = `mongodb+srv://${mongoUser}:${mongoPass}@cluster0-nydon.mongodb.net/${mongoDbName}?retryWrites=true`;

var express = require("express");
var cors = require("cors");
var app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

var stateKey = "spotify_auth_state";

const client = new MongoClient(mongoConnStr, {
  useNewUrlParser: true
});
let db;

const createConn = async () => {
  await client.connect();
  db = client.db("Spotiq");
};

app.use("/queue", Queue);

const performQueryUpdateUsers = async (privateId, userName, userId, points) => {
  const users = db.collection("users");

  const newUser = {
    privateId,
    userName,
    userId,
    points
  };

  return {
    insertedUser: newUser,
    mongoResult: await users.insertOne(newUser)
  };
};

const performQueryUpdateQueues = async (privateId, queue) => {
  const queues = db.collection("queues");

  const newQueue = {
    privateId,
    queue
  };

  return {
    insertedQueue: newQueue,
    mongoResult: await queues.insertOne(newQueue)
  };
};

var generateRandomString = function(length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var server = app.listen(process.env.PORT || 5000, err => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${process.env.PORT || 3000}`);
});

app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//add new user to mongodb
app.post("/new_user", async (req, res, next) => {
  let privateId = req.body.privateId;
  let userName = req.body.userName;
  let userId = req.body.userId;
  let points = req.body.points;

  if (!client.isConnected()) {
    // Cold start or connection timed out. Create new connection.
    try {
      await createConn();
    } catch (e) {
      res.json({
        error: e.message
      });
      return;
    }
  }
  try {
    res.json(
      await performQueryUpdateUsers(privateId, userName, userId, points)
    );
    return;
  } catch (e) {
    res.send({
      error: e.message
    });
    return;
  }
});

app.get("/express_backend", (req, res) => {
  res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
});

app.get("/callback", function(req, res) {
  let code = req.query.code || null;
  let authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri,
      grant_type: "authorization_code"
    },
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64")
    },
    json: true
  };
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token;
    let expiration = body.expires_in;
    console.log("body of token: ", body);
    let uri = process.env.FRONTEND_URI || "http://localhost:3000";
    //set the access token insidedb
    //in db, once access token set , pair with user name
    res.redirect(uri + "?access_token=" + access_token + "&expr=" + expiration);
  });
});

app.get("/login", function(req, res) {
  console.log("loggin in to spotify...");
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = "user-read-playback-state user-modify-playback-state";
  return res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      })
  );
});

app.post("/get_all_users", async function(req, res) {
  var id = req.body.privateId;
  if (!client.isConnected()) {
    // Cold start or connection timed out. Create new connection.
    try {
      await createConn();
    } catch (e) {
      res.json({
        error: e.message
      });
      return;
    }
  }

  // Connection ready. Perform insert and return result.
  try {
    const users = db.collection("users");
    const query = { privateId: id };
    users.find(query).toArray((err, result) => {
      console.log("result for user: ", result);
      res.send({
        search_id: id,
        users: result
      });
    });
    return;
  } catch (e) {
    res.send({
      error: e.message
    });
    return;
  }
});

//get individual users

app.post("/get_user_by_id", async function(req, res) {
  let privateId = req.body.privateId;
  var userId = req.body.playerId;
  console.log("body for get user: ", req.body);
  if (!client.isConnected()) {
    // Cold start or connection timed out. Create new connection.
    try {
      await createConn();
    } catch (e) {
      res.json({
        error: e.message
      });
      return;
    }
  }

  // Connection ready. Perform insert and return result.
  try {
    const users = db.collection("users");
    const query = { userId: userId, privateId: privateId };
    console.log("query for points: ", query);
    users.find(query).toArray((err, result) => {
      console.log("points data for indiv user : ", result);
      res.send({
        search_id: privateId,
        users: result
      });
    });
    return;
  } catch (e) {
    res.send({
      error: e.message
    });
    return;
  }
});

app.post("/update_user", async function(req, res) {
  var privateId = req.body.privateId;
  var userId = req.body.userId;
  var new_points = req.body.points;
  if (!client.isConnected()) {
    // Cold start or connection timed out. Create new connection.
    try {
      await createConn();
    } catch (e) {
      res.json({
        error: e.message
      });
      return;
    }
  }

  // Connection ready. Perform insert and return result.
  try {
    const users = db.collection("users");
    const query = { privateId: privateId, userId: userId };

    //set new value
    var newvalues = { $set: { points: parseInt(new_points) } };
    console.log("query: ", query);
    //update one
    users.updateOne(query, newvalues, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
    });
    res.send({ status: 200, message: "Succesfully updated" });
  } catch (e) {
    res.send({
      error: e.message
    });
    return;
  }
});

app.post("/update_queue", async function(req, res) {
  var id = req.body.privateId;
  var queue = req.body.queue;

  if (!client.isConnected()) {
    // Cold start or connection timed out. Create new connection.
    try {
      await createConn();
    } catch (e) {
      res.json({
        error: e.message
      });
      return;
    }
  }

  // Connection ready. Perform insert and return result.
  try {
    const queues = db.collection("queues");
    const query = { privateId: id };

    //set new value
    var newvalues = { $set: { queue: queue } };

    //check if there is existing queue
    queues.find(query).toArray(async (err, result) => {
      if (result.length > 0) {
        //update the queue
        queues.updateOne(query, newvalues, function(err, res) {
          if (err) throw err;
        });
      } else {
        //create new queue
        res.json(await performQueryUpdateQueues(id, queue));
      }
      res.send({
        search_id: id,
        queues: result
      });
    });

    //update one

    return;
  } catch (e) {
    res.send({
      error: e.message
    });
    return;
  }
});

app.post("/get_queue", async function(req, res) {
  var id = req.body.privateId;
  if (!client.isConnected()) {
    // Cold start or connection timed out. Create new connection.
    try {
      await createConn();
    } catch (e) {
      res.json({
        error: e.message
      });
      return;
    }
  }

  // Connection ready. Perform insert and return result.
  try {
    const queues = db.collection("queues");
    const query = { privateId: id };
    queues.find(query).toArray((err, result) => {
      console.log("result for queues: ", result);
      res.send({
        search_id: id,
        queues: result
      });
    });
    return;
  } catch (e) {
    res.send({
      error: e.message
    });
    return;
  }
});
