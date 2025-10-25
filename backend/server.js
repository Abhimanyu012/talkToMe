import express from 'express'
import { http } from 'http'
import { Server } from 'socket.io'

import cors from 'cors'


const app = express();
const server = http.createServer(app)
app.use(cors())
const PORT = 5000

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

const userSocketMap = {}; // userId -> socket.id
// optional: room membership stored by socket.io internally

// main connection entrypoint
io.on("connection", (socket) => {
  // simple broadcast for demo chat
  socket.on("send_message", (msg) => {
    // broadcast to all clients (including sender)
    io.emit("received_message", msg);
  });
  console.log("Connected:", socket.id);

  // store user id on socket.data when registering
  socket.on("register_user", (userId) => {
    // keep mapping userId -> socket.id
    userSocketMap[userId] = socket.id;
    // also attach to socket for easy cleanup
    socket.data.userId = userId;
    console.log(`Registered user ${userId} => ${socket.id}`);
  });

  // private 1:1 message
  socket.on("private_message", ({ toUserId, message }) => {
    const targetSocketId = userSocketMap[toUserId];
    if (targetSocketId) {
      // send only to target socket
      io.to(targetSocketId).emit("receive_message", {
        fromUserId: socket.data.userId || null,
        toUserId,
        message,
        type: "private",
        createdAt: new Date().toISOString(),
      });
    } else {
      // optional: handle offline user (store to DB / notification)
      socket.emit("delivery_error", { reason: "User offline" });
    }
  });

  // join a group (room)
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    socket.emit("joined_room", { roomId });
    // optionally notify room members
    socket.broadcast.to(roomId).emit("user_joined", {
      userId: socket.data.userId || socket.id,
      roomId,
    });
  });

  // group message
  socket.on("group_message", ({ roomId, message }) => {
    // emit to all members in room (including sender)
    io.to(roomId).emit("receive_message", {
      fromUserId: socket.data.userId || null,
      roomId,
      message,
      type: "group",
      createdAt: new Date().toISOString(),
    });
  });

  // typing indicator
  socket.on("typing", ({ roomId, userId }) => {
    socket.broadcast.to(roomId).emit("typing", { roomId, userId });
  });

  // disconnect cleanup
  socket.on("disconnect", (reason) => {
    console.log("Disconnected:", socket.id, reason);
    // remove user mapping
    const uid = socket.data.userId;
    if (uid && userSocketMap[uid] === socket.id) {
      delete userSocketMap[uid];
    }
    // optionally notify others
  });
});
server.listen(PORT, () => {
    console.log(`server is running at port http://localhost:${PORT}`)
})