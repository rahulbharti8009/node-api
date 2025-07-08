const express = require("express");
const {
  onUserCreate,
  getChatUsers,
  getChatGroups,
  addChatGroups,
} = require("../controller/user.controller");

const router = express.Router(); // storage config

router.post("/chatLoginSignup", onUserCreate);
router.get("/chatusers", getChatUsers);
router.post("/addchatgroups", addChatGroups);
router.post("/getchatgroups", getChatGroups);



module.exports = router;
