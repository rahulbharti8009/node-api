const jwt = require('jsonwebtoken')
const secret = "Rahul@1234$"

async function setUser(user) {
        return jwt.sign(user, secret)
}

async function getUser(token){
    return jwt.verify(token, secret)
}

module.exports = {getUser, setUser}