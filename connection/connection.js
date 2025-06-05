const mongoose = require('mongoose');

async function connectMongoDb(params) {
     mongoose.connect(params).then(async()=> {
        console.log("Server is connected");
    }).catch(()=> {
        console.log("Connection is failed");
    })
}

module.exports = {
    connectMongoDb
}