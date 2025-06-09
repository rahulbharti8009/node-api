const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name : {
    type : String, require : true
  },
  email : {
    type : String, require : true, unique : true
  },
  address :{
    type : String, default: '',
  },

  skills : {
    type :[{
      name: {type : String, default: '',}, rating: {type : Number, default: '', min: 1, max : 5}
    }],
  },
  language: {
    type: String,
  },
  hobbies: {
    type: String,
    default: '',
  },
  password : {
    type : String, require : true
  },
  token:{type : String, default : ''}, 
  role:{type : String, default : ''}, 

}, {timestamps: true})

const User = mongoose.model('user', userSchema)

module.exports = User