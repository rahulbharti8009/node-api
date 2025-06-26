const mongoose = require("mongoose");
const fs = require("fs");
const { default: axios } = require("axios");

async function connectMongoDb(params) {
  mongoose
    .connect(params)
    .then(async () => {
      console.log("Server is connected");
      // Create uploads folder if not present
      if (!fs.existsSync("uploads")) {
        fs.mkdirSync("uploads");
      }
    })
    .catch(() => {
      console.log("Connection is failed");
    });
}

const connectedUsers = new Map();

async function connectSocketIO(io) {
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log(`User connected: ${userId} (Socket ID: ${socket.id})`);

    if (userId) {
      connectedUsers.set(userId, socket.id);
    }
    socket.on("user-message", (msg) => {
      console.log("user-message", msg);
      const socketParamsFrom = `message${msg.clientFrom}-${msg.clientTo}`;
      const socketParamsTo = `message${msg.clientTo}-${msg.clientFrom}`;
      if (msg.clientTo == msg.clientFrom) {
        io.emit(socketParamsFrom, msg);
      } else {
        io.emit(socketParamsFrom, msg);
        io.emit(socketParamsTo, msg);
      }
    });
    socket.on("getUsers", async () => {
      axios
        // .get("https://reinvented-raspy-clam.glitch.me/api/chatusers")
        .get(`${process.env.BASE_URL}api/chatusers`)
        .then((response) => {
                console.log("getUsers");

          const usersWithOnlineStatus = response.data.value.map((user) => ({
            ...user,
            online: connectedUsers.has(user.mobile), // or user._id / user.id based on your backend
          }));

          io.emit("users", usersWithOnlineStatus);
        })
        .catch((error) => {
          console.error("GET error:", error);
        });
    });
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
      // Remove disconnected user
      if (userId) {
        connectedUsers.delete(userId);
        io.emit("getUsers"); // 🔁 update others
      }
    });
  });
}

module.exports = {
  connectMongoDb,
  connectSocketIO,
};
