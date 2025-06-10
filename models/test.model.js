const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name : {
    type : String, default : ""
  }
}, {timestamps: true})

const Test = mongoose.model('test', testSchema)

module.exports = Test