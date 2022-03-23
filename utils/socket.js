const socketInit = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["POST", "GET"],
    },
  });
  io.on("connection", (socket) => {
    console.log("socket connected");
  });
};

module.exports = socketInit;
