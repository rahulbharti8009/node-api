const express = require('express')
const { userCreate, getLogin, getTest, userCreateUser, getLoginApi } = require('../controller/user.controller')

const router = express.Router()// storage config

// router.post('/signup', userCreate)
// router.post('/login',getLogin)
// router.get('/test',getTest)

router.get('/user/:email',getLoginApi)
router.post('/signup', userCreateUser);





module.exports = router