// + Import NPM Modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import * as http from "http";

// our functions/modules
import { connectToDB } from "./config/connectMongo";
import userRoutes from "./routes/usersRoutes";
import adminRoutes from "./routes/adminRoutes";
import roleRoutes from "./routes/roleRoutes";
import credentialTemplateRoutes from "./routes/credentialTemplateRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import { Server } from "socket.io";

// middlewares
import { errorHandler } from "./middleware/errors";
import rootSocket from "./utils/shareUtils/rootSocket";

// + initialize the dotenv module so that we can access variables in .env file via `process.env`
dotenv.config();

// + call the connect to DB method that reads the connection string from the .env file and connects
connectToDB();

// + initialise the express instance
// + set the app to use JSON so that we can accept JSON data in body
const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "token",
      "Authorization",
    ],
  })
);
// + set all the routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/cred-templates", credentialTemplateRoutes);
app.use("/api/applications", applicationRoutes);

// + use the error handler middleware
app.use(errorHandler);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
  transports: ["websocket", "polling"],
});
rootSocket(io);

// + Set port to either the one in ENV vars or 5000 as a fallback
const PORT = process.env.PORT || 5000;

// + start the express server on the said PORT
server.listen(PORT, () => {
  console.log(`--> HTTP and WebSocket Server started on port : ${PORT}`);
});
