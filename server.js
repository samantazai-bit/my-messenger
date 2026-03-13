const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");

const io = new Server(http);

app.use(express.static("public"));

const users = {};

io.on("connection", (socket) => {
  const username = "User" + Math.floor(Math.random() * 1000);
  users[socket.id] = username;

  io.emit("system", `${username} вошёл в чат`);

  socket.on("message", (msg) => {
    const text = String(msg || "").trim();
    if (!text) return;

    io.emit("message", {
      user: users[socket.id],
      text: text
    });
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    if (username) {
      io.emit("system", `${username} вышел из чата`);
      delete users[socket.id];
    }
  });
});

http.listen(3000, () => {
  console.log("Messenger running on http://localhost:3000");
});