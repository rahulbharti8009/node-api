const express = require("express");
const {
  onUserCreate,
  getChatUsers,
} = require("../controller/user.controller");

const router = express.Router(); // storage config

router.post("/chatLoginSignup", onUserCreate);
router.get("/chatusers", getChatUsers);

module.exports = router;
