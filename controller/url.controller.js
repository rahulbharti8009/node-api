
const {URL} = require('../models/url.model')
const {nanoid} = require("nanoid")

async function generateShortURL(req, res) {
    const shortID = nanoid(8)
    const body = req.body
    if(!body.url) return res.status(400).json({error: "url is required"})

   await URL.create({
        shortId : shortID,
        redirectURL: body.url,
        visitHistory: []
    })
    return res.render("home", {id : shortID})
//    return res.status(200).json({id : shortID})
}


async function getAnalyticsReport(req, res) {
        const shortId = req.params.shortId
        const result = await URL.findOne({shortId})
        return res.json({
            totalClick : result.visitHistory.length,
            analytics: result
        })
}

module.exports = {
    generateShortURL,
    getAnalyticsReport
}