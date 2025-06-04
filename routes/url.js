const express = require('express');
const {  generateShortURL, getAnalyticsReport } = require('../controller/url.controller');

const router = express.Router()

router.post("/",generateShortURL)  
router.get("/analytics/:shortId",getAnalyticsReport)  




module.exports = router;
