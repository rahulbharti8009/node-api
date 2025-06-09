const express = require('express')
const { userCreate, getLogin, getTest } = require('../controller/user.controller')

const router = express.Router()

router.post('/signup',userCreate)
router.post('/login',getLogin)
router.get('/test',getTest)



module.exports = router