const { port } = require("./config/config");

const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  },
});

io.on("connection", (socket) => {
  console.log(`Connected: ${socket.id}`);

  let socketRoom;

  socket.on("join", (roomId) => {
    console.log(`Socket ${socket.id} joining ${roomId}`);
    socket.join(roomId);
    socketRoom = roomId;
  });

  socket.on("chat", (data) => {
    var { token, message } = data;
    // console.log(`token: ${token}, msg: ${message}, room: ${socketRoom}`);
    io.to(socketRoom).emit("chat", data);
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Server is running at PORT ${port}`);
});

//https://levelup.gitconnected.com/handling-socketio-rooms-with-react-hooks-4723dd44692e