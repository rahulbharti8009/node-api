const express = require('express');
const { getHomeHtml } = require('../controller/html.controller');
const { URL } = require('../models/url.model');
const router = express.Router()


router.get("/",getHomeHtml)

module.exports = router
