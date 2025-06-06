const mongoose = require('mongoose');
const Test = require('../models/test.model');

async function connectMongoDb(params) {
     mongoose.connect(params).then(async()=> {
        console.log("Server is connected");
        for(let i = 0 ; i < 1000; i++){
              Test.create({
                name : "nn+"+i
            })
        }
    }).catch(()=> {
        console.log("Connection is failed");
    })
}

module.exports = {
    connectMongoDb
}