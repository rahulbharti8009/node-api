const fs = require('fs');
const { getUser } = require('../services/auth');

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

 function hadleTokenMiddleware() {
    return async(req, res, next)=> {
        console.log("I am a  token middleware")
       const authToken =  req.headers["authorization"]
       if (!authToken || !authToken.startsWith("Bearer")) {
        console.log("hadleTokenMiddleware"," No token")
        return next()
       }
       console.log(`authToken ${authToken}`)
       const token = authToken.split(" ")[1];
       const tokenVerify = await getUser(token)
       console.log(`${JSON.stringify(tokenVerify)}`)
       
       if (tokenVerify != null) {
        console.log(`Token is currect`)
        return next()
       }
       console.log(`Please enter valid token`)
       return res.status(200).json({status : false ,message :"Please enter valid token"})
    }
}

module.exports = {
    logReqRes,
    hadleTokenMiddleware
}