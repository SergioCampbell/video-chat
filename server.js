const { Server } = require("socket.io");

const io = new Server(5000, {
  cors: true,
});

const usernameToSocketIdMap = new Map();
const socketIdToUsernameMap = new Map();

io.on("connection", (socket) => {
  console.log(`Socket Connected : ${socket.id}`);
  socket.on("room:join", (data) => {
    const { username, room } = data;
    // mapping the username to socket id
    usernameToSocketIdMap.set(username, socket.id);
    socketIdToUsernameMap.set(socket.id, username);
    // join the room
    io.to(room).emit("user:joined", { username, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, answer }) => {
    io.to(to).emit("call:accepted", { from: socket.id, answer });
  });

  socket.on("peer:negociation:needed", ({ to, offer }) => {
    console.log("negociation needed", offer);
    io.to(to).emit("peer:negociation:needed", { from: socket.id, offer });
  });

  socket.on("peer:negociation:accepted", ({ to, answer }) => {
    console.log("negociation accepted", answer);
    io.to(to).emit("peer:negociation:accepted", { from: socket.id, answer });
  });
});
