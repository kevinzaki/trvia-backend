const Room = require("./room.js"); /** Room Class */
const { FETCH_TOKEN } = require("./client");

const express = require("express"); /** require express */
const socketio = require("socket.io"); /** require socket io */
const cors = require("cors");
const PORT = process.env.PORT || 3000;

const app = express(); /** create an instance of express server */
const expressServer = app.listen(PORT, () =>
  console.log(`Listening on ${PORT}`)
); /** express server */

app.use(cors());

/** create an instance of socketio and pass it our http server we are binding to */
const io = socketio(expressServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["content-type"]
  }
});

const rooms = {}; /** all current games */

io.on("connection", socket => {
  console.log(`A new user with a socket id of ${socket.id} has connected.`);

  /** host creates new game */
  socket.on("createRoom", ({ id, roundSettings }) => {
    if (!rooms[id]) {
      FETCH_TOKEN()
        .then(token => {
          rooms[id] = new Room(id, token, socket.id, roundSettings);
        })
        .then(() => console.log(rooms[id]));
    }
    socket.join(id);
    console.log(`socket id ${socket.id} created and joined room ${id}`);
  });

  /** player joins game */
  socket.on("joinRoom", ({ id, name }) => {
    console.log(name);
    const room = rooms[id];
    if (!room) return;
    socket.join(id);
    room.addPlayer(socket.id, name);
    if (room.getPlayer(socket.id)) {
      io.to(rooms[id].hostId).emit("newPlayer", { id: socket.id, name }); // alert host of new player
    }
    console.log(`socket id ${socket.id} joined room ${id}`);
  });

  /** host begins game */
  socket.on("startGame", ({ roomId, roundSettings }) => {
    const room = rooms[roomId];
    if (room) {
      room.setRoundSettings(roundSettings);
      io.to(socket.id).emit("gameStarted");
    }
  });

  /** host requests question */
  socket.on("getQuestion", ({ roomId, round }) => {
    const room = rooms[roomId];
    if (room) {
      (async () => {
        await room.newQuestion(room.getCategoryId(round));
        io.to(socket.id).emit("question", room.getQuestion()); // send to host
        socket.to(roomId).emit("answers", room.getQuestionAnswers()); // send to players
      })();
    }
  });

  /** host requests answer */
  socket.on("getCorrectAnswer", ({ roomId }) => {
    const room = rooms[roomId];
    console.log(room.getCorrectAnswer());
    if (room) io.in(roomId).emit("correctAnswer", room.getCorrectAnswer());
  });

  /** player submits answer */
  socket.on("submitAnswer", ({ roomId, userId, ans }) => {
    const room = rooms[roomId];
    if (room) room.answerQuestion(userId, ans);
  });

  /** host requests scores */
  socket.on("getScores", ({ roomId }) => {
    const room = rooms[roomId];
    if (room) {
      io.to(socket.id).emit("scores", { scores: room.getScores() }); // send host scores
    }
  });

  /** host alerts server the game is over */
  socket.on("endGame", ({ roomId }) => {
    const room = rooms[roomId];
    if (room[roomId]) delete room[roomId];
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} has disconnected.`);
  });
});
