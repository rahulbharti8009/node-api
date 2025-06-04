const { URL } = require("../models/url.model")


async function getHomeHtml(req, res)  { 
    const allURL = await URL.find({})
   return res.render('home', {
    urls : allURL
   })
    // return res.end(`
    //     <html>  <head></head> </body> <ol> ${allURL.map((user)=> `<li> ${user.shortId} ${user.redirectURL}</li>`).join("")}</ol>  </body> </html>
    //     `)
}


module.exports = {getHomeHtml}