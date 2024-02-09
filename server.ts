import express from "express";
import { createServer } from "http";
import router from "./src/routes/routes";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { connect } from "./src/db/db";
import {
  getAllUser,
  getUserById,
  insertMessage,
} from "./src/service/userService";
import cors from "cors";

const app = express();

const server = createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

connect();

let inRoom: string[] = [];

const getApiAndEmit = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  socket.on("send_message", async (payload) => {
    try {
      if (payload.sendAll) {
        const users = await getAllUser(payload.from);
        const senderDetails = await getUserById(payload.from);
        if (users)
          for (const user of users)
            io.emit(`message_received_${user._id.toString()}`, {
              ...payload,
              from: senderDetails.userName,
              to: user.userName,
            });
      } else {
        await insertMessage(payload);
        io.emit(`message_received_${payload.to}`, payload);
      }
    } catch (error) {}
  });
  socket.on("start_typing", (payload) => {
    io.emit(`started_typing_${payload.from}_${payload.to}`);
  });

  socket.on("end_typing", (payload) => {
    io.emit(`ended_typing_${payload.from}_${payload.to}`);
  });

  socket.on("on_join_room", (userName) => {
    if (userName && !inRoom.find((item) => item === userName))
      inRoom.push(userName);
    io.emit("update_join_array", inRoom);
  });

  socket.on("on_left_room", (userName) => {
    inRoom = inRoom.filter((name) => name !== userName);
    io.emit("update_join_array", inRoom);
  });
};

io.on("connect", (socket) => {
  getApiAndEmit(socket);
  socket.on("disconnect", () => {
    console.log("Socket connection destroyed");
  });
});

app.use(cors());
app.use(express.json());

app.use("/", router);

const PORT = 8000;

app.set("PORT", PORT);

server.listen(app.get("PORT"), () => {
  console.log(`Server is running on: ${PORT}`);
});

export { io };
