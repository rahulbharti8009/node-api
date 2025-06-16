const express = require('express')

const  router = express.Router();

router.get('/signup', async(req, res)=> {
   return res.render('signup', {
      name: "" 
   })
})

router.get('/', (req, res) => {
   res.render('chat');
 });

module.exports = router;