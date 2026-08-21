import dotenv from "dotenv";
import { validateEnv } from "./src/utils/validateEnv.js";
dotenv.config();
validateEnv();

import http from "http";
import dns from "dns";

import app from "./src/app.js";
import { initializeSocket } from "./src/socket/socket.js";
import connectDB from "./src/db/index.js";

// DNS configuration for MongoDB Atlas
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

// Connect database
connectDB()
  .then(() => {
    server.listen(process.env.PORT || 9000, () => {
      console.log(`Server is running`);
    });
  })
  .catch((err) => {
    console.error("Database Error:", err);
  });
