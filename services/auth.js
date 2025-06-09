const jwt = require('jsonwebtoken')
const secret = "Rahul@1234$"

async function setUser(user) {
        return jwt.sign(user, secret)
}

async function getUser(token){
    console.log(`token ${token}`)
    if (!token) return null
    try{
    return jwt.verify(token, secret)    
    } catch(error){
        return null
    }
}

module.exports = {getUser, setUser}