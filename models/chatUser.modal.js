const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    mobile: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const ChatUser = mongoose.model("chatuser", userSchema);

module.exports = ChatUser;
