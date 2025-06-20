const express = require("express");
const {
  userCreate,
  getLogin,
  getTest,
  userCreateUser,
  getLoginApi,
  addProject,
  onUserCreate,
  getChatUsers,
} = require("../controller/user.controller");

const router = express.Router(); // storage config

// router.post('/signup', userCreate)
// router.post('/login',getLogin)
// router.get('/',getTest)
router.get('/user/:email',getLoginApi)
router.post('/signup', userCreateUser);
router.post('/addproject', addProject);

module.exports = router;
