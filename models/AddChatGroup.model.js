const mongoose = require("mongoose");


const addChatGroups = new mongoose.Schema({
    name : {
        type : String, default: ""
    },
    admin : {
        type : String, default: ""
    },
    group_user : {
        type : [{
            mobile:{
                type: String, default: ""
            }
        }]
    }
}, {timeseries: true})

const AddChatGroupt = mongoose.model("addchatgroup", addChatGroups)

module.exports = AddChatGroupt