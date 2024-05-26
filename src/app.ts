// Libraries
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { createServer } from "http";

import { Server } from "socket.io";

// Components
import routes from "./routes";
import { startDatabase } from "./database/index";
import User from "./database/models/User.model";

startDatabase();

// Init express
const app = express();

// Accept JSONs
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// CORS
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));

// Rate Limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 250,
});
app.use(limiter);

// Routes
app.use(routes);

const rooms: IRoom[] = [];

io.on("connection", (socket) => {
  console.log(`[SOCKET] => A user connected: ${socket.id}`);

  socket.on("joinRoom", async (id: string, _username: string) => {
    const room = rooms.find((room) => room.id === id);
    if (room) {
      const user = await User.findOne({ where: { username: _username } });

      if (!user) return;

      const isInRoom = room.participants.find((participant) => participant.id === user.id)
      console.log(isInRoom)
      if (isInRoom)
        return;

      const { id: userId, username, role } = user;
      room.participants.push({ id: userId, username, role });
    }
  });

  socket.on("sendMessage", (data) => {
    io.emit("receivedMessage", data);
  });

  socket.on("exitRoom", (id: string, _username: string) => {
    console.log("EU")
    const room = rooms.find((room) => room.id === id);
    console.log(room)

    if (room) {
      const user = room.participants.find(
        (participant) => participant.username === _username,
      );
      console.log(user)
      // console.log(room.participants.indexOf(user))
      if (!user) return;

      delete room.participants[room.participants.indexOf(user)] 
      // .slice();
    }
  });
});

export { app, server, rooms };
