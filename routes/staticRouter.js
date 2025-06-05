const express = require('express')

const   router = express.Router();

router.get('/signup', async(req, res)=> {
   return res.render('signup')
})

module.exports = router;