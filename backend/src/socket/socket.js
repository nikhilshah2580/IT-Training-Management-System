import { Server } from "socket.io";

let io = null;

// Initialize Socket.io

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // User Room

    socket.on("join", (userId) => {
      if (!userId) return;

      socket.join(`user:${userId}`);

      console.log(`User ${userId} joined room user:${userId}`);
    });

    // Admin Room

    socket.on("joinAdmin", () => {
      socket.join("admins");

      console.log(`Admin joined admin room: ${socket.id}`);
    });

    // Disconnect

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  console.log("Socket.io initialized");

  return io;
};

// Get Socket.io Instance

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized");
  }

  return io;
};

//Emit Notification
export const emitNotification = ({ userId, notification }) => {
  if (!io) {
    console.error("Socket.io has not been initialized");

    return;
  }

  if (!userId) {
    console.error("emitNotification: userId is required");

    return;
  }

  io.to(`user:${userId}`).emit("notification", notification);

  console.log(`Notification emitted to user:${userId}`);
};

//Emit Notification To Admins

export const emitAdminNotification = (notification) => {
  if (!io) {
    console.error("Socket.io has not been initialized");

    return;
  }

  io.to("admins").emit("notification", notification);

  console.log("Notification emitted to admins");
};
