const mongoose = require('mongoose');

async function connectMongoDb(params = 'mongodb://127.0.0.1:27017/rb') {
    return mongoose.connect(params)
}

module.exports = {
    connectMongoDb
}