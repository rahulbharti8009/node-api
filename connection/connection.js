const mongoose = require('mongoose');
const fs = require('fs');

async function connectMongoDb(params) {
     mongoose.connect(params).then(async()=> {
        console.log("Server is connected");
         // Create uploads folder if not present
         if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
            }
    }).catch(()=> {
        console.log("Connection is failed");
    })
}
const users = {};

async function connectSocketIO(io) {
    io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
       // Save user ID with socket
       socket.on('register', (userid) => {
        users[userid] = socket.id;
        console.log(`User registered: ${userid} -> ${socket.id}`);
      });
      socket.on('user-message', (msg) => {
      io.emit("message" , msg)
    //   callback({
    //     status: 'ok'
    //   });
    });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
}

module.exports = {
    connectMongoDb,connectSocketIO
}