const fs = require('fs')

function logReqRes(filename){
    return (req, res, next)=> {
        console.log("I am a middleware")
        fs.appendFile(filename, `${new Date().getTime()} ${req.ip}: ${req.method} ${req.path}\n`, (err, data)=> {
            if (err) {
                console.error('middleware Error writing file:', err);
                return res.status(500).json("")
            }
            next()
        })
    }
}

module.exports = {
    logReqRes
}