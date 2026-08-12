import { Server } from "socket.io";

let io;

const onlineUsers = new Map();

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("register", (userId) => {
      if (!userId) return;

      onlineUsers.set(userId.toString(), socket.id);

      socket.userId = userId.toString();

      console.log(`User ${userId} connected`);
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
      }

      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const emitNotification = (userId, notification) => {
  if (!io) return;

  const socketId = onlineUsers.get(userId.toString());

  if (!socketId) {
    return;
  }

  io.to(socketId).emit("newNotification", notification);
};
