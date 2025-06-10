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

module.exports = {
    connectMongoDb
}