const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server is running");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const usernameToSocketIdMap = new Map();
const socketIdToUsernameMap = new Map();

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("room:join", (data) => {
    console.log(`Socket Connected : ${socket.id}`);
    const { username, room } = data;
    // mapping the username to socket id
    usernameToSocketIdMap.set(username, socket.id);
    socketIdToUsernameMap.set(socket.id, username);
    // join the room
    io.to(room).emit("user:joined", { username, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});
