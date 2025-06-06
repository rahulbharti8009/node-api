const express = require('express')
const { userCreate, getLogin } = require('../controller/user.controller')

const router = express.Router()

router.post('/signup',userCreate)
router.post('/login',getLogin)


module.exports = router