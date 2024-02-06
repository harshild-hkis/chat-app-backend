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
