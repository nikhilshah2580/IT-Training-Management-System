import { Server } from "socket.io";

let io = null;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    socket.on("join", (userId) => {
      if (!userId) return;

      socket.join(`user:${userId}`);
    });

    socket.on("joinAdmin", () => {
      socket.join("admins");
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized");
  }

  return io;
};

export const emitNotification = ({ userId, notification }) => {
  if (!io || !userId) return;

  io.to(`user:${userId}`).emit("notification", notification);
};

export const emitAdminNotification = (notification) => {
  if (!io) return;

  io.to("admins").emit("notification", notification);
};
