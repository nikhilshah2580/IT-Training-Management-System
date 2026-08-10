import dotenv from "dotenv";
dotenv.config();

import http from "http";
import dns from "dns";

import app from "./src/app.js";
import connectDB from "./src/db/index.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const server = http.createServer(app); 

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 9000, () => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.error("Database Error:", err);
  });
