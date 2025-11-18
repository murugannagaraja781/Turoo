import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("join", (room) => {
    socket.join(room);
    socket.to(room).emit("peer-joined");
  });

  socket.on("offer", ({ room, sdp }) => {
    socket.to(room).emit("offer", sdp);
  });

  socket.on("answer", ({ room, sdp }) => {
    socket.to(room).emit("answer", sdp);
  });

  socket.on("ice", ({ room, ice }) => {
    socket.to(room).emit("ice", ice);
  });
});

server.listen(6000, () => console.log("Server running on 6000"));
