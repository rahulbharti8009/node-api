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
// save mobile number
    if (userId) {
      connectedUsers.set(userId, userId);
    }
    // chat one to one
    socket.on("user-message", (msg) => {
      console.log("user-message", msg);
      const socketParamsFrom = `message${msg.clientFrom}-${msg.clientTo}`;
      const socketParamsTo = `message${msg.clientTo}-${msg.clientFrom}`;
      if (msg.clientTo == msg.clientFrom) {
        console.log("if ", socketParamsFrom)
        io.emit(socketParamsFrom, msg);
      } else {
        console.log("else to", socketParamsTo)
        console.log("else from ", socketParamsFrom)

        io.emit(socketParamsFrom, msg);
        io.emit(socketParamsTo, msg);
      }
    });
    // group chat
    socket.on("addgroup", (data)=> {
    console.log("addgroup", data)
    const {group_user} = data
    console.log("addgroup", group_user)

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.BASE_URL}api/addchatgroups`,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      axios.request(config)
      .then((response) => {
        for(let i = 0; i < group_user.length; i++){
                 const mobile = group_user[i].mobile;
        console.log("group res", mobile);
        io.emit(`getGroupApi${mobile}`, mobile); 
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }); // ======= end add group
     // chat one to one
     socket.on("group", (mobile) => {
      console.log("group", mobile);
      let data = JSON.stringify({
        "mobile": mobile
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.BASE_URL}api/getchatgroups`,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      axios.request(config)
      .then((response) => {
        console.log("group res", response.data);
        io.emit(`group${mobile}`,  response.data.value)
      })
      .catch((error) => {
        console.log(error);
      });
    });
  // users chat
    socket.on("getUsers", async () => {
      axios
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
    // disconnected
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
