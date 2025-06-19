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
const users = {};

async function connectSocketIO(io) {
  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    // Save user ID with socket
    // socket.on("register", (socketParams) => {
    //   users[socketParams] = socketParams;
    //   console.log(`User registered: ${socketParams}`);
    // });
    socket.on("user-message", (msg) => {
      console.log("user-message", msg);
          const socketParamsFrom = `message${msg.clientFrom}-${msg.clientTo}`;
          const socketParamsTo = `message${msg.clientTo}-${msg.clientFrom}`;

      io.emit(socketParamsFrom, msg);
      io.emit(socketParamsTo, msg);

      // io.emit(socketParamsTo, msg);

      //   callback({
      //     status: 'ok'
      //   });
    });
    socket.on("getUsers", async()=> {
      axios.get("http://192.168.101.181:8001/api/chatusers")
      .then((response) => {
        console.log("GET response:", response.data);
        io.emit("users", response.data)
      })
      .catch((error) => {
        console.error("GET error:", error);
      })
    })
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}

module.exports = {
  connectMongoDb,
  connectSocketIO,
};
