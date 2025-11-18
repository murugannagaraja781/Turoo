import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();

// IMPORTANT: Express CORS
app.use(
  cors({
    origin: ["https://turoo.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = http.createServer(app);

// IMPORTANT: Socket.IO CORS
const io = new Server(server, {
  cors: {
    origin: "https://turoo.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
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

// Render will give PORT automatically
const PORT = process.env.PORT || 6000;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
