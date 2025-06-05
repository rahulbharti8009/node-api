const express = require('express')
const { userCreate, getUser } = require('../controller/user.controller')

const router = express.Router()

router.post('/signup',userCreate)
router.get('/login',getUser)


module.exports = router